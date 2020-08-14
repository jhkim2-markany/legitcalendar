import React, { useState, useEffect } from "react";
// import events from "./events";
// import _ from "lodash";
// import moment from 'moment'
import axios from "axios";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment_timezone from "moment-timezone";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.scss";

moment_timezone.tz.setDefault("Asia/Seoul");

const DragAndDropCalendar = withDragAndDrop(Calendar);

// -------------------------------------------------




function Event({ event }) {
  return (
    <span>
      <strong style={{ color: "Coral" }}>{event.title}</strong>
    </span>
  );
}

//Agenda에서 이벤트 주는거
function EventAgenda({ event }) {
  return (
    <span>
      <em style={{ color: "magenta" }}>{event.title}</em>
      <p>{event.desc}</p>
    </span>
  );
}

//allday 이거 지웠고,
function App() {
  //clonedeep 사실 필요없음, 게다가 useEffect에서 db에서 데이터 받을꺼라서 없어도됨
  const [Events, setEvents] = useState([]);
  // const [Events, setEvents] = useState(events);
  const [dayLayoutAlgorithm, setdayLayoutAlgorithm] = useState("no-overlap");


  useEffect(() => {
    axios.get("/api/getEvent").then((response) => {
      // console.log(response);
      // console.log(response.data.event);
      let arr = response.data.event.map((ele) => {
        //map 쓰는법
        let { _id, start, end, desc, title, index } = ele;
        // console.log(ele._id)
        return { _id, title, desc, start: new Date(start), end: new Date(end), index};
      });
      // console.log(arr);
      setEvents(arr);  
    })
  }, []);


  // function handleSelect({ start, end }) {
  //   const title = window.prompt("일정을 추가하세요");
  //   const desc = window.prompt("내용을 추가하세요");
  //   if (title) {
  //     let newEvent = { title, start, end, desc };
  //     axios.post("/api/event", newEvent)
  //     .then((response) => console.log(response.data));
  //     setEvents((events) => [
  //       ...events, //전개를 해줘야 여러개 setEvents를 설정가능
  //       newEvent,
  //     ]);
  //     console.log("newEvnet " + newEvent, newEvent._id)  
  //   }
  //   console.log("이벤트",Events)
  // }

  // function handleSelect({ start, end }) {
  //   const title = window.prompt("일정을 추가하세요");
  //   const desc = window.prompt("내용을 추가하세요");
  //   if (title) {
  //     let newEvent = { title, start, end, desc };
  //     axios.post("/api/event", newEvent)
  //     console.log("만들어진",newEvent)
  //   }
  //   axios.get("/api/getEvent").then((response) => {
  //     let arr = response.data.event.map((ele) => {
  //       let { _id, start, end, desc, title, index } = ele;
  //       return { _id, title, desc, start: new Date(start), end: new Date(end), index};
  //     });
  //     setEvents(arr);
  //     console.log(arr); 
  //   })
  // }      //비동기식이기 때문에 순서대로 실행되는게 아니여서 가끔 실행이 바로바로 갱신이 안되었던것


  function handleSelect({ start, end }) {
    const title = window.prompt("일정을 추가하세요");
    const desc = window.prompt("내용을 추가하세요");
    if (title) {
      let newEvent = { title, start, end, desc };
      axios.post("/api/event", newEvent)
      .then((response) => {
        let arr = response.data.event.map((ele) => {
          let { _id, start, end, desc, title, index } = ele;
          return { _id, title, desc, start: new Date(start), end: new Date(end), index};
        });
        setEvents(arr);
        console.log(arr); 
      })
      console.log("만들어진",newEvent)
    }
  }



  function moveEvent({ event, start, end, title }) {
    console.log(event) //하나만 받아옴 하나만 받아온걸 데이터베이스에 보내고
                          //서버에서 변경된값을 데이터베이스에서 수정하고
                          // 그 결과값을 다시 받아와서 전체 데이터 배열을 map  
    axios
      .post("/api/moveEvent", { _id: event._id, start, end, title}) 
      .then((response) => {
        let arr = response.data.event.map((ele) => {
          let { _id, start, end, desc, title, index } = ele;
          return { _id, title, desc, start: new Date(start), end: new Date(end), index};
        });
        setEvents(arr);
        console.log(arr); 
      })
    }


  function resizeEvent({ event, start, end }) {
    console.log(event._id);
    axios.post("/api/resizeEvent", { _id: event._id, start, end })
    .then((response) => {
      let arr = response.data.event.map((ele) => {
        let { _id, start, end, desc, title, index } = ele;
        return { _id, title, desc, start: new Date(start), end: new Date(end), index};
      });
      setEvents(arr);
      console.log(arr); 
    })
  }



  function onSelectEvent(pEvent) {
    console.log(pEvent)
    const r = window.confirm("일정을 취소합니다.");
    if (r === true) {
      console.log(pEvent)
      axios.post("/api/removeEvent",pEvent)
      .then((response) => {
        let arr = response.data.event.map((ele) => {
          let { _id, start, end, desc, title, index } = ele;
          return { _id, title, desc, start: new Date(start), end: new Date(end), index};
        });
        setEvents(arr);
        console.log(arr); 
      })
    }}



  const localizer = momentLocalizer(moment_timezone);
  return (
    <>
      <h1>일정관리</h1>
      <DragAndDropCalendar
        style={{ height: 400, width: "100%" }}
        popup={true} //+ _x_ more"링크를 클릭하면 잘린 이벤트를 오버레이에 표시합니다.
        selectable={true} //필수 ** 날짜와 범위를 선택할수 있게 만들어줌
        localizer={localizer} //moment 모듈을 이용한 로컬화
        events={Events} //이벤트 나오게 하는거
        allDayAccessor="allday"
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH} //디폴트 뷰
        scrollToTime={new Date()} //**스크롤 시작 위치를 정해줌(안해줘도 될듯)
        defaultDate={moment_timezone().toDate()} //디폴트 날짜
        onSelectSlot={handleSelect} //**날짜 선택시 콜백이 발생한다 -> 위에서 만들어준 handleSelect가 실행
        dayLayoutAlgorithm={dayLayoutAlgorithm} //레이아웃 배열의 알고리즘
        onDragStart={console.log} // 드래그 시작할 떄 => 클릭시
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onDoubleClickEvent={onSelectEvent}
        components={{
          event: Event, //여기서 호버줘야함
          agenda: {
            event: EventAgenda,
          },
        }}
      />
    </>
  );
}

export default App;
