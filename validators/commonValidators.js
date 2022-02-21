const joi = require('joi');

class CommonValidators {

    static addItem() {
        return (req, res, next) => {
            try {
                req.schema = joi.object({
                    title: joi.string().min(1).required(),
                    description: joi.string().min(1).max(50),
                    quantity: joi.number().positive(),
                    price: joi.number().positive(),
                    date: joi.string(),
                    image: joi.string()
                })
                next();
            } catch (err) {
                console.log("CommonValidators - addItem - err: ", err);
                return res.send({ status: 0, message: 'validation error' })
            }
        }
    }

    static listing() {
        return (req, res, next) => {
            try {
                req.schema = joi.object({
                    page: joi.number().positive().required(),
                    pagesize: joi.number().positive().required(),
                })
                next();
            } catch (err) {
                console.log("CommonValidators - listing - err: ", err);
                return res.send({ status: 0, message: 'validation error' })
            }
        }
    }

    static deleteItem() {
        return (req, res, next) => {
            try {
                req.schema = joi.object({
                    id: joi.string().required()
                })
                next();
            } catch (err) {
                console.log("CommonValidators - deleteItem - err: ", err);
                return res.send({ status: 0, message: 'validation error' })
            }
        }
    }

    static validate() {
        return (req, res, next) => {
            try {
                let { value, error } = req.schema.validate(req.body)
                if (error) {
                    return res.status(422).send({ status: 0, message: error.details[0].message })
                }
                req.body = value;
                next();
            } catch (err) {
                console.log("CommonValidators - addItem - err: ", err);
                return res.send({ status: 0, message: 'validation error' })
            }
        }
    }
}

module.exports = CommonValidators;