import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MENU, menuKey } from "utils/menu";
import OrderMenu from "./../components/baja/OrderMenu";
import { db } from "./../firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore/lite";
import { useNavigate } from "react-router-dom";

function LandingOrder() {
  const [mixCoffeeIceNum, setMixCoffeeIceNum] = useState(0);
  const [mixCoffeeHotNum, setMixCoffeeHotNum] = useState(0);
  const [americanoIceNum, setAmericanoIceNum] = useState(0);
  const [americanoHotNum, setAmericanoHotNum] = useState(0);
  const [iceTeaIceNum, setIceTeaIceNum] = useState(0);
  const [lemonadeIceNum, setLemonadeIceNum] = useState(0);
  const [slushIceNum, setSlushIceNum] = useState(0);
  const [cookieNum, setCookieNum] = useState(0);

  const [orderNum, setOrderNum] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderDetails, setOrderDetails] = useState<string>("");

  const resetAllValue = () => {
    setMixCoffeeIceNum(0);
    setMixCoffeeHotNum(0);
    setAmericanoIceNum(0);
    setAmericanoHotNum(0);
    setIceTeaIceNum(0);
    setLemonadeIceNum(0);
    setSlushIceNum(0);
    setCookieNum(0);
  };

  useEffect(() => {
    const mixCoffeeIcePrice = mixCoffeeIceNum * MENU[menuKey[0]];
    const mixCoffeeHotPrice = mixCoffeeHotNum * MENU[menuKey[1]];
    const americanoIcePrice = americanoIceNum * MENU[menuKey[2]];
    const americanoHotPrice = americanoHotNum * MENU[menuKey[3]];
    const iceTeaIcePrice = iceTeaIceNum * MENU[menuKey[4]];
    const lemonadeIcePrice = lemonadeIceNum * MENU[menuKey[5]];
    const slushIcePrice = slushIceNum * MENU[menuKey[6]];
    const cookiePrice = cookieNum * MENU[menuKey[7]];

    setTotalPrice(
      mixCoffeeIcePrice +
        mixCoffeeHotPrice +
        americanoIcePrice +
        americanoHotPrice +
        iceTeaIcePrice +
        lemonadeIcePrice +
        slushIcePrice +
        cookiePrice
    );

    let newOrderDetails: string = "";
    newOrderDetails +=
      mixCoffeeIceNum > 0 ? `${menuKey[0]}*${mixCoffeeIceNum}, ` : "";
    newOrderDetails +=
      mixCoffeeHotNum > 0 ? `${menuKey[1]}*${mixCoffeeHotNum}, ` : "";
    newOrderDetails +=
      americanoIceNum > 0 ? `${menuKey[2]}*${americanoIceNum}, ` : "";
    newOrderDetails +=
      americanoHotNum > 0 ? `${menuKey[3]}*${americanoHotNum}, ` : "";
    newOrderDetails +=
      iceTeaIceNum > 0 ? `${menuKey[4]}*${iceTeaIceNum}, ` : "";
    newOrderDetails +=
      lemonadeIceNum > 0 ? `${menuKey[5]}*${lemonadeIceNum}, ` : "";
    newOrderDetails += slushIceNum > 0 ? `${menuKey[6]}*${slushIceNum}, ` : "";
    newOrderDetails += cookieNum > 0 ? `${menuKey[7]}*${cookieNum}` : "";
    newOrderDetails = newOrderDetails.trim().replace(/,\s*$/, "");
    // 상태 업데이트
    setOrderDetails(newOrderDetails);
  }, [
    mixCoffeeIceNum,
    mixCoffeeHotNum,
    americanoIceNum,
    americanoHotNum,
    iceTeaIceNum,
    lemonadeIceNum,
    slushIceNum,
    cookieNum,
  ]);

  // 주문 접수 코드
  const handleSubmit = async () => {
    // 총 가격 0원 초과일 경우에만 전송
    if (totalPrice > 0) {
      const currentTime = serverTimestamp(); // 현재 시간 가져오기

      const newOrderData = {
        orderNum: orderNum,
        orderDetails: orderDetails,
        totalPrice: totalPrice,
        created_at: currentTime,
        status: "시작전", // To Do
      };
      const orderCollectionRef = collection(db, "orders"); // 'orders' 컬렉션에 대한 참조 생성
      // console.log(newOrderData, "새로운 데이터 출력!")
      try {
        const docRef = await addDoc(orderCollectionRef, newOrderData); // 새로운 주문 문서를 추가
        console.log(
          "새로운 주문이 성공적으로 추가되었습니다. 문서 ID:",
          docRef.id
        );
      } catch (error) {
        console.error("주문 추가 중 오류 발생:", error);
      }
      // 모든 값 지우기
      resetAllValue();
      // 보냈으면 새로 주문 번호 가져오기
      getOrderId();
    } else {
      alert("총 결제금액이 0원이기에, 주문할 수 없습니다.");
    }
  };

  async function getOrderId() {
    const collectionRef = collection(db, "orders");
    const orderQuery = query(
      collectionRef,
      orderBy("created_at", "desc"),
      limit(1)
    ); // createdAt 필드를 기준으로 내림차순으로 정렬하여 최신 문서 1개만 가져오기
    const querySnapshot = await getDocs(orderQuery);
    let data = querySnapshot.docs.map(doc => doc.data());
    const orderData = data[data.length - 1];
    console.log(orderData, "가져온 주문 정보");
    const orderId = orderData["orderNum"];
    setOrderNum(orderId + 1);
  }

  // 랜더링 시에만, 주문 번호 가져오기.
  useEffect(() => {
    getOrderId();
  }, []);

  const navigate = useNavigate();

  const goToOrder = () => {
    navigate("/order");
  };

  return (
    <React.Fragment>
      <Container sx={{ height: "100%" }}>
        {/* Header 부분 */}
        <Grid
          container
          spacing={1}
          alignItems="center"
          sx={{ marginTop: "10px", width: "100%" }}
        >
          <Grid item xs={4} md={4}>
            <Typography
              sx={{
                display: "inline",
                font: "25px solid sans-serif ",
                fontWeight: "bold",
                fontFamily: "Gowum",
                textAlign: "center",
              }}
            >
              주문 번호 -{" "}
              <Typography
                sx={{
                  display: "inline",
                  font: "40px solid sans-serif",
                  fontFamily: "Gowum",
                  fontWeight: "bold",
                }}
              >
                {orderNum}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={4} md={4} container justifyContent="center">
            <Typography
              sx={{
                fontSize: "40px",
                // fontFamily: "cursive",
                fontFamily: "Holtwood One SC",
                fontWeight: "bold",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => window.location.reload()}
            >
              💖해외선교카페✨
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "end",
              height: { xs: "50px", sm: "70px", lg: "90px" },
            }}
          >
            <Button
              // variant="outlined"
              color="success"
              // sx={{ fontWeight: "900" }}
              sx={{
                boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.10)",
                border: "1px solid #2E7D32",
                borderRadius: "10px",
                padding: "5px 5px",
                marginTop: "8px",
                marginBottom: "8px",
                textAlign: "center",
                fontWeight: "bold",
                fontFamily: "Gowum",
                "&:hover": {
                  // color: "black",
                },
              }}
              onClick={() => goToOrder()}
            >
              주문 목록 확인
            </Button>
          </Grid>
        </Grid>
        {/* 주문 탭 */}
        <Box></Box>
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[0]}
              beverageNum={mixCoffeeIceNum}
              setBeverageNum={setMixCoffeeIceNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[1]}
              beverageNum={mixCoffeeHotNum}
              setBeverageNum={setMixCoffeeHotNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[2]}
              beverageNum={americanoIceNum}
              setBeverageNum={setAmericanoIceNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[3]}
              beverageNum={americanoHotNum}
              setBeverageNum={setAmericanoHotNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[4]}
              beverageNum={iceTeaIceNum}
              setBeverageNum={setIceTeaIceNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[5]}
              beverageNum={lemonadeIceNum}
              setBeverageNum={setLemonadeIceNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[6]}
              beverageNum={slushIceNum}
              setBeverageNum={setSlushIceNum}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <OrderMenu
              menuName={menuKey[7]}
              beverageNum={cookieNum}
              setBeverageNum={setCookieNum}
            />
          </Grid>
        </Grid>

        {/* 하단 바 */}
        <Grid
          container
          sx={{
            padding: "5px",
            marginTop: "5px",
          }}
        >
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Button
              variant="outlined"
              onClick={resetAllValue}
              color="error"
              sx={{
                boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.10)",
                borderRadius: "10px",
                width: "25vh",
                height: "12vh",
                textAlign: "center",
                font: "3.5vh Inter, sans-serif ",
                fontWeight: "bold",
                fontFamily: "Gowum",
              }}
            >
              전체 삭제
            </Button>
          </Grid>
          {/* 주문 내역 */}
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Typography
              sx={{
                fontSize: "2.4vh",
                fontFamily: "Gowum",
                marginLeft: "10px",
              }}
            >
              {orderDetails}
            </Typography>
          </Grid>
          {/* 총 결제 금액 */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ marginRight: "20px" }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "3.5vh",
                  textAlign: "end",
                  fontFamily: "Gowum",
                }}
              >
                총 결제금액
              </Typography>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: { sm: "4vh", md: "5vh", lg: "5.5vh" },
                  textAlign: "end",
                  fontFamily: "Gowum",
                }}
              >
                {totalPrice.toLocaleString()}원
              </Typography>
            </Box>
          </Grid>
          {/* 주문 접수 버튼 */}
          <Grid item xs={12} sm={6} md={3}>
            <Button
              onClick={handleSubmit}
              // color="success"
              sx={{
                // background: "linear-gradient(180deg, #FFF 0%, #FBFCFF 100%)",
                backgroundColor: "#0085FF",
                boxShadow: "0px 1px 1px 0px #6F98FF",
                border: "1px solid #6F98FF",
                borderRadius: "10px",
                width: "100%",
                height: "13vh",
                textAlign: "center",
                font: "3.5vh Inter, sans-serif ",
                color: "white",
                fontWeight: "bold",
                fontFamily: "Gowum",
                "&:hover": {
                  color: "black",
                },
              }}
            >
              주문하기
            </Button>
          </Grid>
        </Grid>
        {/* </Box> */}
      </Container>
    </React.Fragment>
  );
}

export default LandingOrder;
