import { Box, Button, TextField, Typography } from "@mui/material";
import { MENU } from "utils/menu";

interface OrderMenuProps {
  menuName: string;
  beverageNum: number;

  setBeverageNum: React.Dispatch<React.SetStateAction<number>>;
}

const OrderMenu = ({
  menuName,
  beverageNum,
  setBeverageNum,
}: OrderMenuProps) => {
  const buttonColor = beverageNum > 0 ? "blue" : "black";
  const borderColor = beverageNum > 0 ? "blue" : "rgba(201, 216, 255, 1)";

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        onClick={() => {
          setBeverageNum(beverageNum + 1);
        }}
        sx={{
          background: "linear-gradient(180deg, #FFF 0%, #FBFCFF 100%)",
          boxShadow: "0px 1px 1px 0px rgba(0, 0, 0, 0.10)",
          border: "1px solid rgba(201, 216, 255, 1)",
          borderColor: borderColor,
          borderRadius: "10px",
          width: "100%",
          // width: "336px",
          height: "15vh",
          // height: "110px",
          textAlign: "center",
          font: "3vh Inter, sans-serif ",
          color: "black",
          fontWeight: "bold",
          marginBottom: "5px",
          fontFamily: "Gowum",
        }}
      >
        {menuName} <br />
        {MENU[menuName].toLocaleString()}원
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0px",
          padding: "0px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* 마이너스 버튼 */}
          <Button
            sx={{
              minWidth: "auto",
              "& .MuiButton-startIcon": {
                margin: "0px",
              },
            }}
            onClick={() => {
              if (beverageNum > 0) {
                setBeverageNum(beverageNum - 1);
              }
            }}
            startIcon={
              <svg
                style={{
                  maxWidth: "45px",
                  maxHeight: "45px",
                  width: "6vh",
                  height: "6vh",
                }}
                viewBox="0 0 45 45"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_22_513)">
                  <path
                    d="M22.5 0C34.9365 0 45 10.0635 45 22.5C45 34.9365 34.9365 45 22.5 45C10.0635 45 0 34.9365 0 22.5C0 10.0635 10.0635 0 22.5 0ZM22.5 42.2314C33.3545 42.2314 42.1875 33.3545 42.1875 22.5C42.1875 11.6455 33.3545 2.8125 22.5 2.8125C11.6455 2.8125 2.8125 11.6455 2.8125 22.5C2.8125 33.3545 11.6455 42.2314 22.5 42.2314ZM20.9619 23.9062H12.6562C11.8652 23.9062 11.25 23.291 11.25 22.5C11.25 21.709 11.8652 21.0938 12.6562 21.0938H32.3438C33.1348 21.0938 33.75 21.709 33.75 22.5C33.75 23.291 33.1348 23.9062 32.3438 23.9062H20.9619Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_22_513">
                    <rect width="45" height="45" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
          ></Button>
          {/* 개수 입력 창 */}
          <TextField
            variant="outlined"
            value={beverageNum}
            InputProps={{
              inputProps: {
                style: {
                  textAlign: "center",
                  padding: "0",
                  fontSize: "2.8vh",
                },
              },
              style: {
                borderRadius: "50px",
                width: "7vh",
                height: "7vh",
                maxWidth: "45px",
                maxHeight: "45px",
                // width: '6vh',
                // height: '6vh',
                color: buttonColor,
                fontFamily: "Gowum",
                fontWeight: "bold",
                textAlign: "center",
              },
            }}
            sx={{
              textAlign: "center",
              width: "auto",
            }}
            color="secondary"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = parseInt(event.target.value);
              if (isNaN(newValue)) {
                setBeverageNum(0);
              } else {
                setBeverageNum(newValue);
              }
            }}
          />
          {/* 플러스 버튼 */}
          <Button
            onClick={() => {
              setBeverageNum(beverageNum + 1);
            }}
            sx={{
              minWidth: "auto", // 최소 너비를 자동으로 설정하여 아이콘에 맞춤
              // maxWidth: "20px", // 최소 너비를 자동으로 설정하여 아이콘에 맞춤
              "& .MuiButton-startIcon": {
                margin: "0px", // 아이콘과 텍스트 사이의 간격 조정
              },
            }}
            startIcon={
              <svg
                style={{
                  maxWidth: "45px",
                  maxHeight: "45px",
                  width: "6vh",
                  height: "6vh",
                }}
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_16_43)">
                  <path
                    d="M23.4375 0.0625C11.0112 0.0625 0.9375 10.1362 0.9375 22.5625C0.9375 34.9895 11.0112 45.0625 23.4375 45.0625C35.8645 45.0625 45.9375 34.9895 45.9375 22.5625C45.9375 10.1362 35.8645 0.0625 23.4375 0.0625ZM23.4375 42.2943C12.582 42.2943 3.75 33.418 3.75 22.5624C3.75 11.7069 12.582 2.87491 23.4375 2.87491C34.293 2.87491 43.125 11.7069 43.125 22.5624C43.125 33.4179 34.293 42.2943 23.4375 42.2943ZM33.2812 21.1562H24.8438V12.7188C24.8438 11.9425 24.2137 11.3125 23.4375 11.3125C22.6613 11.3125 22.0312 11.9425 22.0312 12.7188V21.1562H13.5938C12.8175 21.1562 12.1875 21.7863 12.1875 22.5625C12.1875 23.3387 12.8175 23.9688 13.5938 23.9688H22.0312V32.4062C22.0312 33.1825 22.6613 33.8125 23.4375 33.8125C24.2137 33.8125 24.8438 33.1825 24.8438 32.4062V23.9688H33.2812C34.0575 23.9688 34.6875 23.3387 34.6875 22.5625C34.6875 21.7863 34.0575 21.1562 33.2812 21.1562Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_16_43">
                    <rect
                      width="45"
                      height="45"
                      fill="white"
                      transform="translate(0.9375 0.0625)"
                    />
                  </clipPath>
                </defs>
              </svg>
            }
          ></Button>
        </Box>
        <Typography
          sx={{
            fontWeight: "bold",
            fontFamily: "Gowum",
            fontSize: { xs: "4.5vw", sm: "3.5vw", md: "2vw", lg: "2vw" },
            textAlign: "start",
          }}
        >
          {(beverageNum * MENU[menuName]).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderMenu;
