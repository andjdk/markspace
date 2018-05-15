"use strict";

var MarkSpaceItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.postImageSource = obj.postImageSource;
		this.postContent = obj.postContent;
		this.postDate = obj.postDate;
        this.postID = obj.postID;
		this.author = obj.author;
	} else {
	    this.postImageSource = "";
	    this.postContent = "";
	    this.postDate = "";
        this.postID = "";
        this.author = "";
	}
};

MarkSpaceItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var MarkSpace = function () {

    LocalContractStorage.defineProperty(this, "size");

    LocalContractStorage.defineMapProperty(this, "arrayMap", {
        parse: function (text) {
            return new MarkSpaceItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

MarkSpace.prototype = {
    init: function () {
        this.size = 1;
    },

    len:function(){
      return this.size;
    },

    save: function (postImageSource, postContent,postDate) {

        postImageSource = postImageSource;
        postContent = postContent;
        postDate = postDate.trim();
        if (postImageSource === "" || postContent === "" || postDate === ""){
            throw new Error("empty postImageSource / postContent / postDate");
        }

        var from = Blockchain.transaction.from;

        var index = this.size;

        var markspaceItem = new MarkSpaceItem();
        markspaceItem.author = from;
        markspaceItem.postImageSource = postImageSource;
        markspaceItem.postContent = postContent;
        markspaceItem.postDate = postDate;
        markspaceItem.postID = index;
        
        this.arrayMap.put(index, markspaceItem);
        this.size +=1;

    },

    get: function (postID) {

        if ( postID <= 0 ) {
            throw new Error("postID [1..]")
        }
        return this.arrayMap.get(postID);
    },

    getList: function(offset, limit) {
        offset = parseInt(offset);
        limit = parseInt(limit);
        if(offset>this.size){
           throw new Error("offset is not valid");
        }
        var number = offset+limit;
        if(number > this.size){
          number = this.size;
        }
        var result = new Array();
        for(var i=offset;i<number;i++){
            var text = this.arrayMap.get(i);
            result.push(text);
        }
        return result;
    }
};
module.exports = MarkSpace;