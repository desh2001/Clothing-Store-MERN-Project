const isShopOpen = true
const haveMoney = true
const isVehicleOkay = true
const bringMeChocolate = new Promise(
    (resolve , reject) => {

        setTimeout(() => {
        if(isShopOpen){
            if(haveMoney){
                if(isVehicleOkay){
                    resolve({
                        brand: "diary",
                        flavour:"Fruit and nuts"
                    })
                }else{
                    reject()
                }
            }else{
                reject()
            }
        }else{
            reject()
        }
    }
    , 5000);
}
)

console.log("Software Started....")

bringMeChocolate.then(
    (chochlate) => {
        console.log("Hurry ! I got the chocalate",chochlate)
    }
).catch(
    () => {
        console.log("I am sad! I did not get the chocalate")
    }
).finally(
    () => {
        console.log("End of the Program")
    }
)