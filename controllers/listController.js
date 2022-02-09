const { Items } = require('../models/listSchema');

class ListController {

    constructor(req, res, next) {
        this.res = res;
        this.req = req;
        this.next = next;
    }

    async fetchList() {
        this.res.send('Birds home page')
    }


    async addItem() {
        this.res.send('Add items')
    }
}

module.exports = ListController;