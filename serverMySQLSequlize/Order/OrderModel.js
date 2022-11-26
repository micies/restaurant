import { MenuFunctions } from "../Menu/MenuController.js";
import { OrederFunctions } from "./OrderController.js"
import { Orders } from "./OrderTypes.js";

export function createOrder(req, res) {
    const gig = req.body;
    OrederFunctions.create(gig).
        then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}

export function getByIdOrder(req, res) {
    Orders.removeAttribute("id");

    Orders.findAll({
        where: {
            idTable: req.params.id  
        }
      }).then((data) => {
                let dishes = {}
    for (let element of data){
      dishes[element['idDish']]= element['quantity']
    }
    console.log(dishes)
            res.send(dishes);
        })
        .catch((error) => {
            console.log(error);
        });
}

export function deleteOrder(req, res) {
    OrederFunctions.deleteById(req.params.id).
        then((data) => {
            res.status(200).json({
                message: "Gig deleted successfully",
                gig: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

export function updateOrder(req, res) {
    OrederFunctions.updateGig(req.body, req.params.id).
        then((data) => {
            res.status(200).json({
                message: "Gig updated successfully",
                gig: data
            })
        })
        .catch((error) => {
            console.log(error);
        });
}

export const getAllOrder = (req, res) => {
    OrederFunctions.findAll().
        then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log(error);
        });
}


export const calculateSumOrder = async (req, res, next) => {
    let sumPrice = 0;
    let orders = await OrederFunctions.findById(req.params.id).catch((err)=>{console.log(err)})

    for (const property of orders) {
        let calculate = await MenuFunctions.findById(property["idDish"]).catch((err)=>{console.log(err)});

      sumPrice = sumPrice + calculate.price * property["quantity"]
      console.log(calculate.price * property["quantity"])
    }
    res.send({sum:`${sumPrice}`})
}


export const postReservation = async(req, res, next) => {

    for (const [key, value] of Object.entries(req.body.reservations)) {

           const foundItem = await Orders.findByPk({idTable: req.params.id, idDish:key}).catch((err)=>{console.log(err)});
           if (!foundItem) {
                newItem = {
                    idTable:id,
                    idDish:key,
                    quantity:value
                }
                const item = await OrederFunctions.create(newItem).catch((err)=>{console.log(err)})
                return res.send ({item, created: true});
            }
            const item = await OrederFunctions.updateGig(newItem, {where:{idTable: req.params.id, idDish:key}}).catch((err)=>{console.log(err)});
            return res.send ({item, created: false});
        }

    }