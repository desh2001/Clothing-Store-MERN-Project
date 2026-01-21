import toast from "react-hot-toast";

export function getCart(){
    const cartString = localStorage.getItem("cart");

    if(cartString == null){
        // initialize as JSON string
        localStorage.setItem("cart", JSON.stringify([]));
        notifyCartUpdated();
        return [];
    }else{

        try {
            return JSON.parse(cartString);
        } catch (e) {
            // If parse fails, reset cart
            localStorage.setItem("cart", JSON.stringify([]));
            notifyCartUpdated();
            return [];
        }

    }


}

export function addCart(product,quantity){
    const cart = getCart();
    const index = cart.findIndex(
        (item) => {
           return item.productID === product.productID
    });
    if(index == -1){

        cart.push({
           productID: product.productID,
           name: product.name,
           price: product.price,
           labelledPrice: product.labelledPrice,
           quantity: quantity,
           image: product.images[0]
       
    })
    toast.success("Added to Cart");
    
}else{
        const newQty = cart[index].quantity + quantity;

        if(newQty <= 0){
            cart.splice(index,1);
            toast.success("Removed from Cart");
        }else{
            cart[index].quantity = newQty;
            toast.success("Updated Cart Quantity");
        }
        
}
    localStorage.setItem("cart", JSON.stringify(cart));
    notifyCartUpdated();
}

export function emptyCart(){
    localStorage.setItem("cart", JSON.stringify([]));
    notifyCartUpdated();
}

export function getCartTotal(){
    let total = 0
    const cart = getCart();

    cart.forEach(
        (item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;
            total += (price * qty);
        }
    )
    return total;
}

//add get count of items in cart
export function getCartItemCount() {
    const cart = getCart(); 
    return cart.length;
}

// notify other components when cart changes
function notifyCartUpdated() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartUpdated"));
    }
}