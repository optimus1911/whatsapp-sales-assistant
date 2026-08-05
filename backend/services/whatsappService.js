import axios from "axios";

export const sendWhatsAppMessage = async (toPhone, messageText) => {
  try {
    const url = `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    console.log("Sending to URL:", url);
    console.log("To:", toPhone);
    console.log("Message:", messageText);

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: toPhone,
        text: {
          body: messageText,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("WhatsApp Response:");
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "WhatsApp Send Error:",
      error.response?.data || error.message
    );
  }
};