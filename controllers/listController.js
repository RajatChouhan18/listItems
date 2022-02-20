const { Items } = require('../models/listSchema');
const Form = require('../services/Form');
const File = require('../services/File');
const _ = require('lodash')
const path = require('path')
const config = require('../configs/configs');

class ListController {

    constructor(req, res, next) {
        this.res = res;
        this.req = req;
        this.next = next;
    }

    async fetchList() {
        let reqData = this.req.body,
            page = reqData.page ? reqData.page : 1,
            pagesize = reqData.pagesize ? reqData.pagesize : 10,
            sort = reqData.sort ? reqData.sort : { 'createdAt': -1 },
            skip = (Number(page) - 1) * Number(pagesize),
            limit = pagesize ? Number(pagesize) : 10,
            findQuery = []
        if (reqData.filter) {
            let filter = reqData.filter;
            if (filter.search)
                findQuery.push({ 'title': { $regex: `.*${filter.search}.*`, $options: 'i' } })
            if (filter.field === 'date') {
                if (filter.type === 'before') {
                    findQuery.push({ 'createdAt': { $lte: filter.value } })
                } else if (filter.type === 'after') {
                    findQuery.push({ 'createdAt': { $gte: filter.value } })
                }
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
        this.res.send({ 'status': 0, 'message': "Fetched list successfully", listResponse })
    }

    async addItem() {
        this.res.send('Add items')
    }

    async fileUpload() {
        try {
            let form = new Form(this.req);
            let formObject = await form.parse();
            if (_.isEmpty(formObject.files)) {
                return this.res.status(202).send({ status: 0, message: "File is required" });
            }
            let imagePath = "/public/upload";
            const file = new File(formObject.files);
            /***** uncommit this line to do manipulations in image like compression and resizing ****/
            let { fileObject, name } = await file.store({ "imagePath": imagePath });
            fileObject.filePath = config.serverHost + fileObject.filePath;
            return this.res.status(200).send({ status: 1, message: "File uploaded successfully", data: { ...fileObject, name } });
        } catch (error) {
            console.log("error- ", error);
            this.res.status(202).send({ status: 0, message: "Internal server error" });
        }
    }

}

module.exports = ListController;