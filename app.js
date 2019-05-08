const MongoClient = require('mongodb').MongoClient,
      assert = require('assert');

let url = 'mongodb+srv://tedyage:a1b2c3d4@cluster0-prhoi.mongodb.net/test?retryWrites=true'

var startTime = Date.now();
MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    assert.equal(null,err);
    let time = Date.now()-startTime;
    console.log(`Connected successfully to server in ${time} ms.`);
    const db = client.db('test');
    startTime = Date.now();
    insertOneDocument(db,function(){
        insertDocuments(db,function(){
            findAllDocuments(db,function(){
                findDocumentsWithSomeFilter(db,{'a':1},function(){
                    findOneDocument(db,{'a':3},function(){
                        updateOneDocument(db,{'a':2},function(){
                            updateDocumentsWithFilter(db,{'a':2},function(){
                                deleteOneDocument(db,{'a':2},function(){
                                    deleteDocuments(db,function(){
                                        createIndex(db,{'a':1},function(){
                                            client.close();
                                        });
                                    });                                   
                                });                               
                            });
                        });
                    });                    
                });
            });       
        });
    });   
});

function insertOneDocument(db,callback){
    db.collection('documents')
    .insertOne({"a":4},function(err,{insertedCount=0,ops=[],insertedId=null,connection={},result={}}={}){
        assert.strictEqual(err,null);
        assert.strictEqual(insertedCount,1);
        assert.strictEqual(ops.length,1);
        assert.strictEqual(result.ok,1);
        assert.strictEqual(result.n,1);
        let time = Date.now()-startTime;
        console.log(`Insert 1 document into the collection in ${time} ms.`);
        startTime = Date.now();
        callback();
    })
}

function insertDocuments(db,callback){
    //Get collection.
    let collection = db.collection('documents');
    //Insert some documents
    collection.insertMany([
        {a:1},{a:2},{a:3}
    ],function(err,{insertedCount=0,ops=[],insertedIds={},connection={},result={}}={}){
        assert.equal(null,err);          //
        assert.equal(3,insertedCount);   //成功插入数据量
        assert.equal(3,ops.length);      //成功返回的数据，3个json
        assert.equal(1,result.ok);       //ok为1代表，数据插入成功
        assert.equal(3,result.n);        //n为3代表，插入三条数据
        let time = Date.now()-startTime;
        console.log(`Inserted 3 documents into the collection in ${time} ms.`);
        startTime = Date.now();
        callback();
    });
}

function findAllDocuments(db,callback){
    //Get collection.
    let collection = db.collection('documents');
    //Find some documents
    collection.find({}).toArray(function(err,documents){
        let time = Date.now() - startTime;
        assert.equal(err,null);
        console.log(`Found the following records in ${time} ms.`);
        //console.log(documents);
        startTime = Date.now();
        callback();
    });
}

function findDocumentsWithSomeFilter(db,filter,callback){
    //Get collection
    let collection = db.collection('documents');
    //Find some documents
    collection.find(filter).toArray(function(err,documents){
        let time = Date.now() - startTime;
        assert.equal(err,null);
        console.log(`Found the following records match the filter in ${time} ms.`);
        //console.log(documents);
        startTime = Date.now();
        callback();
    })
}

function findOneDocument(db,filter,callback){
    db.collection('documents')
    .findOne(filter,function(err,document={}){
        assert.strictEqual(err,null);
        assert.notStrictEqual(document,null);
        let time = Date.now()-startTime;
        console.log(document);
        console.log(`Found one record match the filter in ${time} ms.`);
        startTime = Date.now();
        callback();
    });
}

function updateOneDocument(db,filter,callback){
    //Get collection
    let collection = db.collection('documents');
    //Update some documents
    collection.updateOne(filter,{
        "$set":{
            "b":7
        }
    },function(err,{result={},connection={},matchedCount=0,modifiedCount=0,upsertedCount=0,upsertedId={},message={},ops=[]}={}){
        assert.strictEqual(err,null);
        assert.strictEqual(result.ok,1);
        assert.ok(result.n>=1);
        assert.ok(result.nModified>=0);
        assert.ok(matchedCount>=1);
        assert.ok(modifiedCount>=0);
        assert.strictEqual(upsertedCount,0);
        let time = Date.now()-startTime;
        console.log(`Update one record match the filter in ${time} ms.`);
        startTime = Date.now();
        callback();
    });
}

function updateDocumentsWithFilter(db,filter,callback){
    db.collection('documents').updateMany(filter,{
        $set:{
            "c":3
        }
    },function(err,{result={},connection={},matchedCount=0,modifiedCount=0,upsertedCount=0,upsertedId={},message={},ops=[]}={}){
        assert.strictEqual(err,null);
        assert.strictEqual(result.ok,1);
        assert.ok(result.n>=1);
        assert.ok(result.nModified>=0);
        assert.ok(matchedCount>=1);
        assert.ok(modifiedCount>=0);
        assert.strictEqual(upsertedCount,0);
        let time = Date.now()-startTime;
        console.log(`Update the following records match the filter in ${time} ms.`);
        callback();
    })
}

function deleteOneDocument(db,filter,callback){
    db.collection('documents')
    .deleteOne(filter,function(err,{result={},connection={},deletedCount=0}={}){
        assert.strictEqual(err,null);
        assert.notStrictEqual(result,null);
        assert.strictEqual(deletedCount,1);
        let time = Date.now()-startTime;
        console.log(`Delete one record matches the filter in ${time} ms.`);
        startTime = Date.now();
        callback();
    });
}

function deleteDocuments(db,callback){
    db.collection('documents')
    .deleteMany({},function(err,{result={},connection={},deletedCount=0}={}){
        assert.strictEqual(err,null);
        assert.notStrictEqual(result,null);
        assert.ok(deletedCount>0);
        let time = Date.now()-startTime;
        console.log(`Delete the whole records in ${time} ms.`);
        startTime = Date.now();
        callback();
    })
}

function createIndex(db,item,callback){
    db.collection('documents')
    .createIndex(item,function(err,result={}){
        assert.strictEqual(err,null);
        assert.notStrictEqual(result,null);
        let time = Date.now()-startTime;
        console.log(`Create a index in ${time} ms.`);
        startTime = Date.now();
        callback();
    });
}



