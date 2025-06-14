import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  updateDoc,
} from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function OrderList() {
  // 행 종류
  const columns: GridColDef[] = [
    { field: "orderNum", headerName: "주문 번호", align: "center" },
    {
      field: "orderDetails",
      headerName: "주문 내역",
      headerAlign: "center",
      editable: true,
      width: 500,
    },
    {
      field: "status",
      headerName: "주문 상태",
      width: 120,
    },
    { field: "totalPrice", headerName: "결제 금액", type: "number" },
    {
      field: "created_at",
      headerName: "주문 시간",
      type: "string",
      width: 120,
      valueGetter: (params: any) => {
        return new Date(params.seconds * 1000).toLocaleString("ko-KR", {
          // month: 'short',
          // day: 'numeric',
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
      },
    },
    {
      field: "actions",
      headerName: "주문 삭제",
      width: 120,
      renderCell: (params) => (
        <Button
          sx={{ fontSize: "0.8rem" }}
          onClick={() => handleDeleteSelectedRows(params.row.id)}
          disabled={!selectionModel.includes(params.row.id)}
        >
          삭제
        </Button>
      ),
    },
  ];
  const [fetchedRows, setFetchedRows] = useState<any[]>([]);
  const [todoOrders, setTodoOrders] = useState<any[]>([]);
  const [inProgressOrders, setInProgressOrders] = useState<any[]>([]);
  const [doneOrders, setDoneOrders] = useState<any[]>([]);
  const [totalPriceSum, setTotalPriceSum] = useState(0);
  const [sortModel, setSortModel] = useState<any[]>([
    { field: "orderNum", sort: "desc" },
  ]);
  const [selectionModel, setSelectionModel] = React.useState<any[]>([]);

  const handleSortChange = (newSortModel: any) => {
    setSortModel(newSortModel);
  };

  const handleSelectionChange = (params: any) => {
    setSelectionModel(params);
  };

  const handleDeleteSelectedRows = async (event?: React.MouseEvent, id?: string) => {
    const idsToDelete = id ? [id] : selectionModel;
    if (idsToDelete.length === 0) return;
    
    if (
      window.confirm("삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?")
    ) {
      try {
        const batch = writeBatch(db);
        idsToDelete.forEach(id => {
          const docRef = doc(db, "orders", id);
          batch.delete(docRef);
        });
        await batch.commit();
        
        const updatedRows = fetchedRows.filter(row => !idsToDelete.includes(row.id));
        setFetchedRows(updatedRows);
        await getOrders();
      } catch (error) {
        console.error("삭제 중 오류가 발생했습니다:", error);
      }
    }
  };

  async function getOrders() {
    const collectionRef = collection(db, "orders");
    const querySnapshot = await getDocs(collectionRef);
    const data: any[] = querySnapshot.docs.map(doc => ({
      id: doc.id, // Firebase 문서의 고유 ID를 id로 사용
      created_at: doc.data().created_at,
      status: doc.data().status,
      ...doc.data(),
    }));

    const todo = data.filter(order => order.status === "시작전");
    const inProgress = data.filter(order => order.status === "진행중");
    const done = data.filter(order => order.status === "완료");

    setTodoOrders(todo);
    setInProgressOrders(inProgress);
    setDoneOrders(done);
    console.log(data, "가져온 주문 정보 출력");
    setFetchedRows(data);

    const totalPriceSum = data.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.totalPrice;
    }, 0);
    setTotalPriceSum(totalPriceSum);
  }

  // 랜더링 시에만, 주문 내역 가져오기.
  useEffect(() => {
    getOrders();
  }, []);

  // 데이터를 CSV 형식으로 변환
  function convertToCSV(data: any[]) {
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data
      .map(obj =>
        Object.values(obj)
          .map((value: any) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : typeof value === "object"
              ? new Date(value.seconds * 1000).toLocaleString("ko-KR", {
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })
              : value
          )
          .join(",")
      )
      .join("\n");
    return header + rows;
  }

  // CSV 파일로 저장 및 다운로드
  function saveCSVToFile(csvData: string) {
    const blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8",
    }); // MIME 타입 변경
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "카페 회계내역.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // CSV 파일로 저장 버튼 클릭 시 처리
  function handleDownloadClick() {
    const saveData = fetchedRows.map(item => ({
      주문번호: item.orderNum,
      주문내역: item.orderDetails,
      결제금액: item.totalPrice,
      주문시간: item.created_at,
    }));

    const csvData = convertToCSV(saveData);
    saveCSVToFile(csvData);
  }

  const navigate = useNavigate();

  const goToOrder = () => {
    navigate("/");
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const orderId = draggableId;
    const newStatus = destination.droppableId;

    // Update the order status in Firebase
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      // Update the state to reflect the changes
      getOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <React.Fragment>
      <Container>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "60px",
            }}
          >
            <Typography 
              sx={{ 
                fontSize: "2rem", 
                fontFamily: "Gowum",
                cursor: "pointer",
              }}
              onClick={() => window.location.reload()}
            >
              ✨남현 카페 주문목록☕
            </Typography>
            <Button
              color="success"
              sx={{
                boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.10)",
                border: "1px solid #2E7D32",
                borderRadius: "10px",
                padding: "7px 7px",
                marginTop: "8px",
                marginBottom: "8px",
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "Gowum",
                "&:hover": {},
              }}
              onClick={() => goToOrder()}
            >
              주문 페이지 이동👉🏻
            </Button>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              {/* {selectionModel.length > 0 && ( // 선택된 행이 있을 때만 버튼이 나타남
                <Button
                  sx={{ fontSize: "0.8rem" }}
                  onClick={handleDeleteSelectedRows}
                >
                  주문 삭제
                </Button>
              )} */}
              <Typography sx={{ fontSize: "1.4rem", fontFamily: "Gowum" }}>
                총 판매액:
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  fontFamily: "Gowum",
                }}
              >
                {totalPriceSum.toLocaleString()}원
              </Typography>
              <Button sx={{ fontSize: "0.8rem" }} onClick={handleDownloadClick}>
                회계 내역 다운로드
              </Button>
            </Box>
          </Box>

          {/* 대시보드 */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              rowGap: 1,
              columnGap: 2,
              mb: 2,
              fontFamily: "Pretendard",
            }}
          >
            {["시작전", "진행중", "완료"].map((status, idx) => (
              <Box
                key={`header-${status}`}
                sx={{ textAlign: "center", fontWeight: "bold", padding: "8px" }}
              >
                <Typography
                  sx={{
                    backgroundColor: ["#FFEAEA", "#EAF4FF", "#E7F6EC"][idx],
                    color: ["#C62828", "#1565C0", "#2E7D32"][idx],
                    borderRadius: "12px",
                    padding: "6px 12px",
                    display: "inline-block",
                    fontSize: "0.875rem", // 약간 작고 세련된 크기
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {status}
                </Typography>
              </Box>
            ))}

            {["시작전", "진행중", "완료"].map(status => (
              <Droppable droppableId={status} key={status}>
                {provided => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      background: "linear-gradient(135deg, #f7f7f7, #ebebeb)",
                      padding: 2,
                      minHeight: "200px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      overflowX: "hidden",
                      borderRadius: "16px",
                      border: "1px solid #e0e0e0",
                      boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.05)",
                      transition: "background 0.3s ease",
                    }}
                  >
                    {(status === "시작전"
                      ? todoOrders
                      : status === "진행중"
                      ? inProgressOrders
                      : doneOrders
                    ).map((order, index) => (
                      <Draggable
                        key={order.id}
                        draggableId={order.id}
                        index={index}
                      >
                        {provided => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              borderLeft: `3px solid ${
                                status === "시작전"
                                  ? "#EF5350"
                                  : status === "진행중"
                                  ? "#42A5F5"
                                  : "#66BB6A"
                              }`,
                              textDecoration: `${
                                status === "완료" ? "line-through" : "none"
                              }`,
                              color: `${
                                status === "완료" ? "#888888" : "black"
                              }`,
                              backgroundColor: "#FAFAFA",
                              paddingX: 2.5,
                              paddingY: 2,
                              marginBottom: "8px",
                              borderRadius: "12px",
                              boxShadow:
                                "0 4px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)",
                              transition: "all 0.2s ease-in-out",
                              wordBreak: "keep-all",
                              cursor: "grab",
                              "&:hover": {
                                boxShadow:
                                  "0 6px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1)",
                                transform: "translateY(-2px)",
                                backgroundColor: "#F5F5F5",
                              },
                              "&:active": {
                                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
                                backgroundColor: "#EDEDED",
                                transform: "scale(0.98)",
                              },
                            }}
                          >
                            [{order.orderNum}]-{order.orderDetails} -{" "}
                            {order.totalPrice}원
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ))}
          </Box>

          <Box>
            <DataGrid
              rows={fetchedRows}
              columns={columns}
              sx={{ fontWeight: "medium", fontFamily: "Pretendard" }}
              sortModel={sortModel}
              onSortModelChange={handleSortChange}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={handleSelectionChange}
              autoHeight
              checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </DragDropContext>
      </Container>
    </React.Fragment>
  );
}

export default OrderList;
