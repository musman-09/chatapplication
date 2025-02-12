import React, { useEffect, useState } from "react";
import { ref, push, onValue, remove, get } from "firebase/database";
import send from "../assets/images/send-removebg-preview.png";
import { database } from "../Firbase/firebaseconfig";
import optionsvg from "../assets/images/options svg.svg";
import docicon from "../assets/images/doc icon.svg";
import photoicon from "../assets/images/photo svg.svg";
import cameraicon from "../assets/images/camera icon.svg";
import recordericon from "../assets/images/recorder icon.svg";
import angledown from "../assets/images/angle down.svg";
import { collectionGroup } from "firebase/firestore";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { supabase } from "../supabase/SupabaseClient";


const ChatArea = ({ userDetails, selectedUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [onCLose, setonCLose] = useState(false);
  const [optionModal, setOptionModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [messageModalId, setMessageModalId] = useState();
  const [recordingModal, setRecordingModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState()

  const handleOption = () => {
    setOptionModal(!optionModal);
  };

  const handlemessageoption = (id) => {
    setMessageModal(!messageModal)
    setMessageModalId(id)
  }

  const handleRecorder = () => {
    setRecordingModal(!recordingModal)
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file)
      setOptionModal(!optionModal);
    }
  };

  const handleDelete = async (id) => {
    try {
      const snapshot = await get(ref(database));
      if (snapshot.exists()) {
        const chatNodes = Object.keys(snapshot.val());

        console.log(chatNodes, "are chat nodes");
        const nodeIndex = chatNodes.findIndex(
          (node) =>
            node.includes(
              `${userDetails.username}_${selectedUser.username}`
            ) ||
            node.includes(`${selectedUser.username}_${userDetails.username}`)
        );
        console.log(nodeIndex, " at index node are there");
        if (nodeIndex !== -1) {
          const messageRef = ref(database, `${chatNodes[nodeIndex]}/chats/${id}`);

          const messageSnapshot = await get(messageRef);
          if (messageSnapshot.exists()) {

            await remove(messageRef);
            console.log(`Message with ID ${id} has been deleted.`);
          }
        }
      }
    } catch (error) {
      console.error("Error checking chat nodes:", error);
    }
  }

  // const generateRoomId = (user1, user2) => {
  //   return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  // };

  // const handleSend = () => {
  //   if (message.trim() !== "") {
  //     const newMessage = {
  //       text: message,
  //       timestamp: Date.now(),
  //       sender: userDetails?.username,
  //       receiver: selectedUser.username,
  //     };

  //     const roomId = generateRoomId(
  //       userDetails.username,
  //       selectedUser.username
  //     );

  //     const messagesRef = ref(database, `${roomId}/chats`);
  //     push(messagesRef, newMessage);
  //     setMessage("");
  //   }
  // };

  const handleSend = async () => {
    if (selectedFile) {
      const { data, error } = await supabase
        .storage
        .from('chatImages')
        .upload(`images/${selectedFile?.name}`, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

    }

    const publicURL = supabase.storage
      .from("chatImages")
      .getPublicUrl(`images/${selectedFile?.name}`).data.publicUrl;

    console.log(publicURL, "is public url")

    const newMessage = {
      text: message || (publicURL ? "Sent a file" : ""),
      type: selectedFile ? "file" : "text",
      fileUrl: publicURL || null,
      timestamp: Date.now(),
      sender: userDetails?.username,
      receiver: selectedUser.username,
    };

    console.log("pura msg", newMessage);

    try {
      const snapshot = await get(ref(database));
      if (snapshot.exists()) {
        const chatNodes = Object.keys(snapshot.val());

        console.log(chatNodes, "are chat nodes");
        const nodeIndex = chatNodes.findIndex(
          (node) =>
            node.includes(`${userDetails.username}_${selectedUser.username}`) ||
            node.includes(`${selectedUser.username}_${userDetails.username}`)
        );

        console.log(nodeIndex, " at index node are there");

        if (nodeIndex !== -1) {
          const chatRef = ref(database, `${chatNodes[nodeIndex]}/chats`);
          push(chatRef, newMessage);
        } else {
          const sortedUsernames = [userDetails.username, selectedUser.username]
            .sort()
            .join("_");
          const chatRef = ref(database, `${sortedUsernames}/chats`);
          push(chatRef, newMessage);
          console.log("chalo bhai new node bangai");
        }


        setMessage("");
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error checking chat nodes:", error);
    }
  };



  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!selectedUser) return;

    const sortedUsernames = [userDetails.username, selectedUser.username]
      .sort()
      .join("_");

    const messagesRef = ref(database, `${sortedUsernames}/chats`);
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messagesArray = Object.entries(data).map(([id, msg]) => ({
          id,
          data: msg,
        }));

        setMessages(messagesArray);
      } else {
        console.log("No messages found");
        setMessages([]);
      }
    });
  }, [selectedUser, userDetails.username]);

  return (
    <div className="w-3/4 h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100">
        <div>
          <h1 className="text-xl font-semibold"> {selectedUser.username} </h1>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="text-xl text-gray-600 hover:text-gray-900"
          style={{ cursor: "pointer" }}
        >
          &#10005; {/* Cross Mark for Close Button */}
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((v) => (
          <div
            key={v.id}
            className={`flex ${v.data.sender === userDetails.username
              ? "justify-end"
              : "justify-start"
              } px-4 py-2 relative ghsbdfgd `}
          >
            <div
              className={`group max-w-xs px-4 py-2 rounded-lg shadow relative ${v.data.sender === userDetails.username
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
                } `}
            >

              {v.data.type === "file" && v.data.text? (
                <> 
                <img src={v.data.fileUrl} alt="Uploaded" className="max-w-xs rounded-md" />
                {v.data.text}
                </>
              )
                : (
                  v.data.text
                )}



              <div
                onClick={() => handlemessageoption(v.id)}
                className={`absolute top-0 right-0 opacity-0 ${v.data.sender === userDetails.username ? "group-hover:opacity-100" : ""
                  } transition-all rounded-md`}
              >
                <img className="w-6 h-6 cursor-pointer" src={angledown} alt="Options" />
              </div>

              {
                messageModalId === v.id && messageModal && v.data.sender === userDetails.username ? <div className="absolute
                 top-4 right-4  bg-white shadow-md rounded-md shadow-black z-10"
                >
                  <ul className="text-gray-500 flex flex-col w-full">

                    <li onClick={() => { handleDelete(v.id) }} className="cursor-pointer hover:bg-gray-200  px-4 py-2">delete</li>
                  </ul>

                </div> : null
              }







            </div>



          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <div className="flex items-center p-4 border-t bg-gray-300 justify-between relative">

        {
          !recordingModal ? <div className={`relative  ${selectedFile ? "w-1/2" : null}`} style={{ width: "92%" }}>
            <input
              type="text"
              placeholder="Type a message..."
              className={`w-full  px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}

            />

            <img
              onClick={handleOption}
              className="absolute right-4 top-2"
              src={optionsvg}
              alt=""
            />

            {optionModal ? (
              <>
                <div className="optionmodal absolute bg-white shadow-black shadow-md border-gray-200" style={{ bottom: "160%", right: "2%" }}>
                  <div className=" flex items-center border-2 border-white shadow-md shadow-white rounded-md left-72">

                    <ul className=" flex flex-col gap-6  p-2">
                      <li className="flex gap-2"> <img className="w-6" src={docicon} alt="" /> <span> Document </span> </li>
                      <li onClick={() => document.getElementById("fileInput").click()} className="flex gap-2 cursor-pointer"> <img className="w-6" src={photoicon} alt="" /> <span> photos & videos </span> </li>
                      <li className="flex gap-2 "> <img className="w-6" src={cameraicon} alt="" /> <span> Camera  </span> </li>
                    </ul>



                    <>
                      <input
                        type="file"
                        id="fileInput"
                        name="filename"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </>



                  </div>
                </div>
              </>
            ) : null}
          </div>
            : <div> recording ..  </div>
        }




        {selectedFile ? <div className="border-2 border-gray-200 bg-gray-200 rounded-md p-4 m-2 "> {selectedFile.name} </div> : null}

        <button
          onClick={handleSend}
          className="w-12 text-white rounded-full hover:scale-105"
        >
          {message || selectedFile ? <img src={send} alt="" /> : <img className={`transition-transform ${recordingModal ? "scale-125 filter brightness-75" : ""}`} onClick={handleRecorder} src={recordericon} alt="" />}



        </button>
      </div>
    </div>
  );
};

export default ChatArea;
