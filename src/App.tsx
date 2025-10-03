import Button from "@mui/material/Button";
import "./App.css";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

function App() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL; 

    function getVariantFromCookie() {
        const match = document.cookie.match(/(?:^| )button_variant=([^;]+)/);
        return match ? match[1] : null;
    }

    function buyNow() {
        axios.post(baseUrl + "shop/buy-now", {}, { withCredentials: true })
            .then(() => {
                toast("Successful");
            })
            .catch((err) => {
                console.log(err);
                toast("Error");
            });
    }

    useEffect(() => {
      const isButtonExpExposed = localStorage.getItem("isExposed_button_variant");
      if (!isButtonExpExposed){
        axios.post(baseUrl + "shop/buy-now-exposed", [], { withCredentials: true }).then(() => {
          toast("Exposed");
        }).catch((err) => {
          console.log(err);
          toast("Failed to expose.")
        })
        localStorage.setItem("isExposed_button_variant", "true");
      }
    }, [])

    const variant = getVariantFromCookie() ?? "A";

    return (
        <>
            <Card style={{ width: 200 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="/src/assets/cool_bread.jpg"
                />
                <CardContent>
                    <Typography>Cool bread</Typography>
                    <Typography>Buy now, eat later!</Typography>
                    <div style={{ marginTop: 10 }}>
                        <Button
                            variant={variant === "A" ? "contained" : "outlined"}
                            color="primary"
                            onClick={buyNow}
                        >
                            Buy now
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <ToastContainer />
        </>
    );
}

export default App;
