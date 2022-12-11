import { Box } from "@mui/material";
import { styled } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import { myClient } from "../..";
import { getConversationsForGroup } from "../../sdkFunctions";
import RegularBox from "../channelGroups/RegularBox";
import { GroupContext } from "../Groups/Groups";
import Input from "../InputComponent/Input";
import Tittle from "./tittle/Tittle";

// Exported Styled Box
export const StyledBox = styled(Box)({
  backgroundColor: "#FFFBF2",
  minHeight: "100vh",
  borderTop: "1px solid #EEEEEE",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

export const ConversationContext = React.createContext({
  conversationsArray: [],
  setConversationArray: () => {},
});

function GroupChatArea() {
  const [conversationsArray, setConversationArray] = useState([]);

  let groupContext = useContext(GroupContext);
  console.log(groupContext);

  const ref = useRef(null);
  const scroll = () => {
    ref.current?.scrollIntoView({ behaviour: "smooth" });
  };
  useEffect(() => {
    const fn = async () => {
      try {
        const chatRoomResponse = await myClient.getChatroom();
      } catch (error) {
        console.log(error);
      }
    };
    scroll();
    // fn()
  });

  useEffect(() => {
    const fn = async (chatroomId, pageNo) => {
      let optionObject = {
        chatroomID: chatroomId,
        page: pageNo,
      };
      let response = await getConversationsForGroup(optionObject);

      if (!response.error) {
        let conversations = response.data;

        let conversationToBeSetArray = [];
        let newConversationArray = [];
        let lastDate = "";
        for (let convo of conversations) {
          if (convo.date == lastDate) {
            conversationToBeSetArray.push(convo);
            lastDate = convo.date;
          } else {
            if (conversationToBeSetArray.length != 0) {
              newConversationArray.push(conversationToBeSetArray);
              conversationToBeSetArray = [];
              conversationToBeSetArray.push(convo);
              lastDate = convo.date;
            } else {
              conversationToBeSetArray.push(convo);
              lastDate = convo.date;
            }
          }
        }
        newConversationArray.push(conversationToBeSetArray);
        setConversationArray(newConversationArray);
      } else {
        console.log(response.errorMessage);
      }
    };
    fn(groupContext.activeGroup.chatroom?.id, 1000);
  }, [groupContext.activeGroup]);

  const [isSelected, setIsSelected] = useState(false);
  const [conversationObject, setConversationObject] = useState({});
  // useEffect(()=>{
  //   const fn = async (chatroomId, pageNo) => {
  //     let optionObject = {
  //       chatroomID: chatroomId,
  //       page: pageNo,
  //     };
  //     let response = await getConversationsForGroup(optionObject);
  //     console.log(response);
  //     if (!response.error) {
  //       let conversations = response.data;
  //       console.log(conversations);
  //       let conversationToBeSetArray = [];
  //       let newConversationArray = [];
  //       let lastDate = "";
  //       for (let convo of conversations) {
  //         if (convo.date == lastDate) {
  //           conversationToBeSetArray.push(convo);
  //           lastDate = convo.date;
  //         } else {
  //           if (conversationToBeSetArray.length != 0) {
  //             newConversationArray.push(conversationToBeSetArray);
  //             conversationToBeSetArray = [];
  //             conversationToBeSetArray.push(convo);
  //             lastDate = convo.date;
  //           } else {
  //             conversationToBeSetArray.push(convo);
  //             lastDate = convo.date;
  //           }
  //         }
  //       }
  //       newConversationArray.push(conversationToBeSetArray);
  //       setConversationArray(newConversationArray);
  //     } else {
  //       console.log(response.errorMessage);
  //     }
  //   };
  //   let intervalId = setInterval(()=>{
  //     fn(groupContext.activeGroup.chatroom?.id, 1000)
  //   }, 1000)

  //   return () => {
  //     clearInterval(intervalId)
  //   }
  // })

  return (
    <ConversationContext.Provider
      value={{
        conversationsArray: conversationsArray,
        setConversationArray: setConversationArray,
      }}
    >
      <CurrentSelectedConversationContext.Provider
        value={{
          conversationObject,
          setConversationObject,
          setIsSelected,
          isSelected,
        }}
      >
        {groupContext.activeGroup.chatroom?.id ? (
          <Tittle
            headerProps={{
              title: groupContext.activeGroup.chatroom.header,
              memberCount: groupContext.activeGroup.participant_count,
            }}
          />
        ) : null}
        <div
          className="relative overflow-x-hidden overflow-auto"
          style={{ height: "calc(100vh - 270px)" }}
        >
          {groupContext.activeGroup.chatroom?.id !== undefined ? (
            <>
              {conversationsArray.map((convoArr, index) => {
                return (
                  <RegularBox convoArray={convoArr} key={convoArr[0].date} />
                );
              })}
              <div
                style={{
                  flexGrow: 0.4,
                }}
              />
              <div ref={ref}></div>
              <div
                className="fixed bottom-0 "
                style={{ width: "calc(100% - 504px)" }}
              >
                <Input />
              </div>
            </>
          ) : (
            <>hi</>
          )}
        </div>
      </CurrentSelectedConversationContext.Provider>
    </ConversationContext.Provider>
  );
}

export const CurrentSelectedConversationContext = React.createContext({
  isSelected: false,
  setIsSelected: () => {},
  conversationObject: {},
  setConversationObject: () => {},
});

export default GroupChatArea;
