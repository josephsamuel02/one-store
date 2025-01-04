import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendSMS = async (data: any) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://my.kudisms.net/api/sms?token=${
      import.meta.env.VITE_KUDI_SMS_API_KEY
    }&senderID=onestore.ng&recipients=${data.recipients},&message=${data.message}&gateway=2`,
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return { message: "unable to send SMS", data: error };
    });
};
