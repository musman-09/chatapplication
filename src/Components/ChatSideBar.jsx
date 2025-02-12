import React, { useEffect, useState } from "react";
import gupshup from "../assets/images/gupshup logo.png";
import { auth, database, db } from "../Firbase/firebaseconfig";
import { collection, getDocs, doc, getDoc, collectionGroup } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ChatArea from "./ChatArea";
import { AiOutlineSetting } from "react-icons/ai";
import wbg from "../assets/images/whatsapp bg.jpg";
import { get, onChildAdded, onChildRemoved, ref } from "firebase/database";
import AuthRoute from "../router/authroute";
import { logout, } from "../Redux/features/AuthRouteSlice";
import { useDispatch } from "react-redux";
import LoadingIcons from "react-loading-icons";


const ChatSidebar = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chattedUsers, setChattedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  const fetchUsers = async (currentUserId) => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const usersList = [];
      snapshot.forEach((doc) => {
        if (doc.id !== currentUserId) {
          usersList.push({ id: doc.id, ...doc.data() });
        }
      });
      setAllUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchChattedUsers = () => {
    if (!userDetails) return;

    const chatRef = ref(database);
    onChildAdded(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const newNode = snapshot.key;


        if (newNode.includes(userDetails.username)) {
          const chattedUsername = newNode
            .replace(`${userDetails.username}_`, "")
            .replace(`_${userDetails.username}`, "");


          if (!chattedUsers.some((user) => user.username === chattedUsername)) {
            const matchedUser = allUsers.find(
              (user) => user.username === chattedUsername
            );
            if (matchedUser) {
              setChattedUsers((prevUsers) => [...prevUsers, matchedUser]);
            }
          }
        }
      }
    });

    onChildRemoved(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const removedNode = snapshot.key;
        if (removedNode.includes(userDetails.username)) {
          const removedUsername = removedNode.replace(`${userDetails.username}_`, "").replace(`_${userDetails.username}`, "");
          const messagesRef = ref(database, `${removedNode}`);
          get(messagesRef).then(messagesSnapshot => {
            if (!messagesSnapshot.exists()) {
              setChattedUsers(prevUsers => prevUsers.filter(user => user.username !== removedUsername));
            }
          });
        }
      }
    });

  };



  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserDetails(userData);
            fetchUsers(user.uid);
          } else {
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (allUsers.length > 0 && userDetails) {
      fetchChattedUsers();
    }
  }, [allUsers, userDetails,]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(logout(null));
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const displayedUsers = searchQuery.trim()
    ? allUsers.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : chattedUsers;

  return (
    <div className="flex">
      <div className="w-1/4 h-screen bg-blue-50 border-r flex flex-col">
        <div className="flex shadow-md shadow-black items-center justify-center border-b bg-blue-100 rounded-md">
          <img className="w-16 p-2" src={gupshup} alt="GupShup Logo" />
          <h1 className="text-2xl font-semibold text-blue-500 font-sans">
            GupShup
          </h1>
        </div>
        <div className="username cursor-pointer text-lg font-semibold text-blue-500 font-sans text-center h-16 flex items-center justify-center border-collapse border-2 border-blue-100 rounded-md shadow-md shadow-black relative">
          {userDetails ? userDetails.username : "Guest"}
          <AiOutlineSetting
            className="ml-2 text-xl cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md w-48">
              <div
                onClick={handleLogout}
                className="p-2 text-sm cursor-pointer hover:bg-gray-200"
              >
                Logout
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingIcons.Bars className="w-12 h-12" fill="#3b82f6" />
            </div>
          ) : (
            <>
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 border-b cursor-pointer hover:bg-blue-100"
                    onClick={() => setSelectedUser(user)}
                  >
                    {user.username}
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500"> .. </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedUser ? (
        <ChatArea
          userDetails={userDetails}
          onClose={() => setSelectedUser(null)}
          selectedUser={selectedUser}
        />
      ) : (
        <div
          className="flex items-center justify-center w-full bg-center"
          style={{ backgroundImage: `url(${wbg})` }}
        >
          <div className="text-center p-6">
            <div className="text-6xl font-semibold text-green-600">
              Welcome, {userDetails?.username} 😊
            </div>
            <div className="text-2xl text-gray-600 mt-2">
              Please search and select a user to chat with.
              <br />
              <span className="text-blue-500 text-2xl font-medium">
                Happy chatting! 😊
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
