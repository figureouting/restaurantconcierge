import axios from 'axios';

export async function bookTable(args: any, placeId: string) {
  const url = 'https://platform.otapi.com/api/bookings'; // example
  const { data } = await axios.post(
    url,
    {
      placeId,
      datetime: args.datetime,
      partySize: args.party_size,
      user: { phone: args.phone, email: args.email }
    },
    { headers: { Authorization: `Bearer ${process.env.OPENTABLE_API_KEY}` } }
  );
  return data.confirmation_code;
}
