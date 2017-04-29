'use strict';
class SpatialHash{
    constructor(range, cellSize){
        //var bounds = getBounds(range);
        this.cellSize = cellSize;
        if (range.width%cellSize !== 0 || range.height%cellSize !== 0)
            throw "Exception: width and height must both be divisible by cell size";
    
        this._horizontalCells = range.width/cellSize;
        this._verticalCells = range.height/cellSize;
        this.hash = [];
        this.range= range;

        var i, j, a;
        for (i = 0; i <= this._horizontalCells-1; i++){
            a = [];
            for (j = 0; j <= this._verticalCells-1; j++)
                a.push([]);
            this.hash.push(a);
        }

        this.objectCount = 0;
        this.cellCount = this._horizontalCells * this._verticalCells;
        this._id = -9e15; //max number of objects
    }

    insert(item) {
        if (!item.range)
            throw "Exception: item has no range object";
        var bounds = getBounds(item.range);
        var hStart = Math.max(~~((bounds.left-this.range.x) / this.cellSize), 0);
        var hEnd = Math.min(~~((bounds.right-this.range.x) / this.cellSize), this._horizontalCells-1);
        var vStart = Math.max(~~((bounds.top-this.range.y) / this.cellSize), 0);
        var vEnd = Math.min(~~((bounds.bottom-this.range.y) / this.cellSize), this._verticalCells-1);
   
        item.__b = {
            hStart: hStart,
            hEnd: hEnd,
            vStart: vStart,
            vEnd: vEnd,
            id: this._id++
        };

        var i, j;
        for (i = hStart; i <= hEnd; i++) {
            for (j = vStart; j <= vEnd; j++)
                this.hash[i][j].push(item);
        }

        if (this.objectCount++ >= 9e15)
            throw "Exception: more than 9E15 (900 000 000 000 000) objects";
        else if (this._id > 9e15 - 1)
            this._id = -9e15;
    }

    remove(item) {
        if (!item.__b) return;
        var hStart = item.__b.hStart;
        var hEnd = item.__b.hEnd;
        var vStart = item.__b.vStart;
        var vEnd = item.__b.vEnd;

        var i, j, k;
        for (i = hStart; i <= hEnd; i++) {
            for (j = vStart; j <= vEnd; j++) {
                k = this.hash[i][j].indexOf(item);
                if (k !== -1) this.hash[i][j].splice(k, 1);
            }
        }
        if (!(delete item.__b)) item.__b = undefined;
        this.objectCount--;
    }

    update(item) {
        this.remove(item);
        this.insert(item);
    }

    __srch(range, selector, callback, returnOnFirst) {
        var bounds = getBounds(range),
            cellSize = this.cellSize;

        // range might be larger than the hash's size itself
        var hStart = Math.max(~~((bounds.left-this.range.x) / this.cellSize), 0);
        var hEnd = Math.min(~~((bounds.right-this.range.x) / this.cellSize), this._horizontalCells-1);
        var vStart = Math.max(~~((bounds.top-this.range.y) / this.cellSize), 0);
        var vEnd = Math.min(~~((bounds.bottom-this.range.y) / this.cellSize), this._verticalCells-1);
   

        var i , j, k, l, m, o = [], p = [];
        for (i = hStart; i <= hEnd; i++) {
            for (j = vStart; j <= vEnd; j++) {
                k = this.hash[i][j];
                l = k.length;
                for (m = 0; m < l; m++)
                    if (intersects(k[m].range, range) && p.indexOf(k[m].__b.id) === -1) {
                        p.push(k[m].__b.id);
                        if (selector) if (!selector(k[m])) continue;
                        if (callback) callback(k[m]);
                        if (returnOnFirst) return true;
                        o.push(k[m]);
                    }
            }
        }
        if (returnOnFirst) return false;
        return o;
    };

    any(range) {
        return this.__srch(range, null, null, true);
    }

    query(range, selector) {
        return this.__srch(range, selector, null, false);
    }

    find(range, callback) {
        return this.__srch(range, null, callback, false);
    }
    print(){
        var i, j;
        for (i = 0; i <= this._horizontalCells-1; i++){
            console.log(this.hash[i]);
        }
    }  
}



function intersects(a, b) {
    return a.x <= b.x + b.width
        && a.x + a.width >= b.x
        && a.y <= b.y + b.height
        && a.y + a.height >= b.y;
}

function getBounds(range) {
    return {
        left: range.x,
        right: range.x + range.width,
        top: range.y,
        bottom: range.y + range.height
    };
}

module.exports = SpatialHash;

