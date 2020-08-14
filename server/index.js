const express = require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
const app = express();  //express를 실행하여 app object를 초기화 합니다
const port = 5000;  // 사용할 포트 번호를 port 변수에 넣습니다. 

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

// const cookieParser = require("cookie-parser");

//클라이언트에서 가져오는 정보를 분석해서 가져올수 있게 한다.
app.use(bodyParser.urlencoded({ extended: true }));
//클라이언트에서 json 타입으로 된것을 분석해서 가져온다.
app.use(bodyParser.json());


app.use(express.json({ extended: true }));
//express에서 제공되는 모듈 -> app.
// app.use(cookieParser());

const { Event } = require("./models/event");


mongoose.connect('mongodb+srv://JWTEX:TIGER@jwt-rkkz2.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true, 
    useFindAndModify: false,
  }).then(() => console.log("DB Connected..."))
    .catch((err) => console.log(err));


    // 아래에다가 씀
    // function getEventList(res) {
    //   Event.find({}).exec()
    //   .then((db)=>{
    //     return res.status(200).json({
    //       success : true,
    //       event: db //event라는 이름으로 db 내용을 가져온다.
    //     })
    //   })
    //    .catch((err)=>{
    //      return res.json({ success: false, err });
    //   // })
    // }

app.get("/api/getEvent", (req, res)=>{
  getEventList(res)
})


//클라이언트에서 받아서 db로 넣는거
app.post("/api/event", (req, res) => { //err,obj 잘 모르겠다
  let { title, end, start, desc, _id } = req.body; 
  console.log(_id);  //아이디가 없으면 undefined가 뜬다.
  if (_id === undefined) {
    _id = new mongoose.Types.ObjectId();  //undefined이면 오브젝트 아이디를 만드러줌
  } // _id가 없으면 만들어준다
  console.log("modified : " + _id);
  Event.findOneAndUpdate(
    { _id: _id }, // 검색조건
    { title: title, start: start, end: end, desc: desc}, //바꾸는 값들
    { upsert: true })// 데이터가 없으면 새로만든다
    .exec()   //exec를 통해서 실행시켜준다 => 비동기를 동기식으로 처리한다. 
    .then((eventInfo) => {        // => 비동기식이였기 때문에 순서의 상관없어서 데이터가 바로 넣어질때랑 딜레이가 잇었을떄가 있었음
      getEventList(res);
    })
    // .catch((err)=>{           //에러를 잡는데 위에 함수에서 대신 해줌
    //   return res.json({ success: false, err });
    // })
});


// app.post("/api/moveEvent", (req, res) => { //err,obj 잘 모르겠다
//   let { title, end, start, desc, _id } = req.body; 
//   Event.findOneAndUpdate(
//     { _id: _id }, // 검색조건
//     { title: title, start: start, end: end, desc: desc}, //바꾸는 값들
//     (err, eventInfo) => {
//       if (err) return res.json({ success: false, err });
//       return res.status(200).json({
//         success: true,
//       });
//     }
//   );
// });


app.post("/api/moveEvent", (req, res) => { //err,obj 잘 모르겠다
  let { _id, start, end} = req.body; // 배열
  console.log( _id, start, end);
  Event.findOneAndUpdate({ _id}, {start, end}, { new :true }).exec((err, eventInfo)=>{
    console.log(eventInfo);
    if(err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      event : eventInfo
    });
  })
});


app.post("/api/resizeEvent", (req, res) => { //err,obj 잘 모르겠다
  console.log(req.body)
  let { _id, start, end } = req.body; // 오브젝트
  console.log( _id, start, end);               //https://www.zerocho.com/category/MongoDB/post/579e2821c097d015000404dc
                                               //new를 쓰는 이유는?? 수정 이후의 다큐먼트를 반환할 지 결정하는 부분입니다. { new: true }를 넣으면 수정 이후의 다큐먼트를 반환합니다. 
  Event.findOneAndUpdate({ _id}, {start, end}, { new :true }).exec((err, eventInfo)=>{
    console.log(eventInfo);
    if(err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      event : eventInfo
    });
  })
});


app.post("/api/removeEvent", (req,rse)=>{
  let { _id } = req.body; // 오브젝트로 묶어줘야한다.
  console.log(req.body)   //{req.body._id}는 안됨
  Event.deleteOne({_id}, function(err,result){
    if(err){
      console.log("err",err)
    } else {
      console.log("result",result)
    }
  });
});


app.listen(port, ()=>{  // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log(`server on! http://localhost:${port}`); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});

function getEventList(res) {
  Event.find({}).exec()
  .then((db)=>{
    // console.log(db)
    return res.status(200).json({
      success : true,
      event: db //event라는 이름으로 db 내용을 가져온다.
    })
  })
  .catch((err)=>{
    return res.json({ success: false, err });
  })
}