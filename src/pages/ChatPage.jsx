import React, { useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatArea from "../components/chat/ChatArea";

export default function ChatPage() {
  // Start with null active ID. Sidebar will auto-select the first MongoDB customer.
  const [activeCustomerId, setActiveCustomerId] = useState(null);

  return (
    <div className="flex h-screen bg-whatsapp-dark">
      <Sidebar
        activeCustomerId={activeCustomerId}
        onSelectCustomer={setActiveCustomerId}
      />

      <ChatArea activeCustomerId={activeCustomerId} />
    </div>
  );
}
