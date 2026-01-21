import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./productPage";
import ProductOverview from "./overview";
import Cart from "./cart";
import Checkout from "./checkOut";
import OrderPage from "./ordersPage";
import HomeContent from "./homecontext";
import Contact from "./contact";
import About from "./about";
import Footer from "../components/footer";
import ReviewAddPage from "./reviewAddPage";

export default function homepage(){
    return(
        <div className="w-full h-full overflow-y-scroll max-h-full">
            <Header/>
            <div className="w-full min-h-[calc(100%-100px)] ">
                <Routes>
                    <Route path="/" element={<HomeContent />} />
                    <Route path="/products" element={<ProductPage/>}/>
                    <Route path="/about" element={<About />}/>
                    <Route path="/contact" element={<Contact />}/>
                    <Route path="/overview/:productID" element = {<ProductOverview />}/>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/*" element={<h1>Page Not Found</h1>}/>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrderPage />} />
                    <Route path="/reviews/add-page" element={<ReviewAddPage />} />
                </Routes>
            </div>
            <Footer/>

        </div>
    )
}