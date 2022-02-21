const { Items } = require('../models/listSchema');
const Form = require('../services/Form');
const File = require('../services/File');
const path = require('path')
const config = require('../configs/configs');
const { ListControllerResponses } = require('../services/responses');
const { isEmpty } = require('lodash');

class ListController {

    constructor(req, res, next) {
        this.res = res;
        this.req = req;
        this.next = next;
    }

    async fetchList() {
        try {
            let reqData = this.req.body,
                page = reqData.page ? reqData.page : 1,
                pagesize = reqData.pagesize ? reqData.pagesize : 10,
                sort = reqData.sort ? reqData.sort : { 'createdAt': -1 },
                skip = (Number(page) - 1) * Number(pagesize),
                limit = pagesize ? Number(pagesize) : 10,
                findQuery = []
            if (reqData.filter) {
                let filter = reqData.filter;
                if (filter.search) {
                    findQuery.push({ 'title': { $regex: `.*${filter.search}.*`, $options: 'i' } })
                    findQuery.push({ 'description': { $regex: `.*${filter.search}.*`, $options: 'i' } })
                }
            }
            const listing = await Items.find({}).sort(sort).skip(skip).limit(limit).lean();
            const total = await Items.countDocuments({});
            const listResponse = {
                'data': listing,
                'total': total,
                'page': page,
                'pagesize': pagesize
            }
            this.res.send({ status: 0, message: ListControllerResponses.LIST_FETCHED, listResponse })
        } catch (err) {
            console.log("ListController - addItem - err: ", err);
            return res.status(500).send({ status: 0, message: ListControllerResponses.INTERNAL_SERVER_ERROR })
        }
    }

    async addItem() {
        try {
            let reqData = this.req.body;
            let itemData = new Items({
                "title": reqData.title.trim(),
                "description": reqData.description.trim(),
                "quantity": Number(reqData.quantity),
                "price": Number(reqData.price),
                "date": new Date(reqData.date),
                "image": reqData.image
            });
            let item = await new Promise(async (resolve, reject) => {
                await itemData.save((err, data) => {
                    if (err) return resolve({ status: 0, message: ListControllerResponses.SOMETHING_WENT_WRONG });
                    return resolve({ status: 1, message: ListControllerResponses.ITEM_ADDED_SUCCESS, data: data._doc });
                });
            })
            if (item.status === 0) return this.res.send(item);
            return this.res.status(200).send({ status: 1, message: item.message, data: item.data });
        } catch (err) {
            console.log("ListController - addItem - err: ", err);
            return res.status(500).send({ status: 0, message: ListControllerResponses.INTERNAL_SERVER_ERROR })
        }
    }

    async deleteItem() {
        try {
            let { id } = this.req.body;
            let removedItem = await Items.deleteOne({ _id: id });
            if (isEmpty(removedItem) || (removedItem && removedItem.deletedCount === 0))
                return this.res.send({ status: 0, message: ListControllerResponses.SOMETHING_WENT_WRONG });
            return this.res.status(200).send({ status: 1, message: ListControllerResponses.ITEM_DELETED });
        } catch (err) {
            console.log("ListController - deleteItem - err: ", err);
            return this.res.status(500).send({ status: 0, message: ListControllerResponses.INTERNAL_SERVER_ERROR })
        }
    }

    async fileUpload() {
        try {
            let form = new Form(this.req);
            let formObject = await form.parse();
            if (isEmpty(formObject.files)) {
                return this.res.status(202).send({ status: 0, message: "File is required" });
            }
            let imagePath = "/public/upload";
            const file = new File(formObject.files);
            /***** uncommit this line to do manipulations in image like compression and resizing ****/
            let { fileObject, name } = await file.store({ "imagePath": imagePath });
            fileObject.filePath = config.serverHost + fileObject.filePath;
            return this.res.status(200).send({ status: 1, message: ListControllerResponses.FILE_UPLOADED_SUCCESS, data: { ...fileObject, name } });
        } catch (error) {
            console.log("error- ", error);
            this.res.status(500).send({ status: 0, message: ListControllerResponses.INTERNAL_SERVER_ERROR });
        }
    }

}

module.exports = ListController;