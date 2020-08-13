db에서 불러온 데이터가 week나 day에 걸쳐있으면 터짐
console에서 보면 스키마가 다른거 같음


allday도 model에 있어야하고, 모멘트?? 때문에 무한 렌더링 대는것도 막아야하고, 


//resize나 move나 remove를 할때 date를 받아서 해야한다. 

// remove는 삭제가 되면 렌더링을 실행하도록 해야한다.




//핸들 셀렉트가 끝나고 axios를 _id값도 받아오니깐
//굳이 index를 줄 필요가 없고, 그럴러면 axios뒤에 setEvnst의 위치를 바꿔야한ㄷ나.
//데이터 베이스에서 가져온 것 이기 때문에 start나 end를 다시 new date 처리를 해줘야한다.
//바로 만들고 옮기면 터지는 이유는
// _id가 없는 이유가 없기떄문인데,
// 따라서 _id로 옮기면 안되고, title로 비교해서 옮겨야 할꺼 같은데
// 그러기 위해서는 데이터 베이스 title을 넣어주고 response로 title을
//받아서 return에서 받아줘야한다. 그리고 리턴에서 new date로 date객체로 받아줘야
//한다. 아마도
//만든 다음에 옮기는거 안됨
//만들고 나서 WEEK로 안됨 
//내 생각에는 DATE가 아니여서 그런듯?
//return을 get때 처럼 date를 넣어줘야할듯





  // function moveEvent({ event, start, end, title }) {
  //   console.log(event) //하나만 받아옴 하나만 받아온걸 데이터베이스에 보내고
  //                         //서버에서 변경된값을 데이터베이스에서 수정하고
  //                         // 그 결과값을 다시 받아와서 전체 데이터 배열을 map  

  //   axios
  //     .post("/api/moveEvent", { _id: event._id, start, end, title})
  //     .then((response) => {
  //       let newEvents = Events.map((ele) => {
  //         console.log(ele)
  //         console.log(event)
  //         // console.log(event._id) //여기나와있는 콘솔을 바꾼거랑 기존꺼랑 비교해보자           
  //         // console.log(`기존꺼 : ${ele._id} ${ele.start} / 바꾼거 : ${response.data.event._id} ${response.data.event.start}`);
  //         return ele._id === response.data.event._id
  //           ? response.data.event
  //           : ele;
  //       });
  //       setEvents(newEvents);
  //     });
  // }






//   function resizeEvent({ event, start, end }) {
//     console.log(event._id);
//     axios.post("/api/resizeEvent", { _id: event._id, start, end }).then((response)=>{
//       // console.log(response.data.event)
//       let newEvents = Events.map((ele)=>{
//         // console.log(`기존꺼 : ${ele._id} ${ele.start} / 바꾼거 : ${response.data.event._id} ${response.data.event.start}`);
//         return (ele._id===response.data.event._id) ? response.data.event : ele
//       })
//       // console.log(Events)
//       // console.log(newEvents); //retrun date 객체로 받아야할꺼 같은데?
//       setEvents(newEvents)
//       // console.log(Events)
//     }).then(console.log(Events))                    
//     //여기다가 then을 사용해서 start를 뉴데이트로 받아줘야할듯?
// }




