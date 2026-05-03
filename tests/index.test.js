const { default: axios } = require("axios");

function sum(a,b){
    return a+b;
}

const BACKEND_URL="http://localhost:3000"
describe("Authentication", ()=>{
    test("User able to signup only once",async()=>{

        const username= "teja"+Math.random();
        const password ="12312312"
        const response=await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password,
            type:"admin"
        })
        expect(response.statusCode).toBe(200);

        const updatedResponse=await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password,
            type:"admin"
        })
        expect(updatedResponse.statusCode).toBe(400);

    })
    
    test("User signup faile if username is empty",async()=>{
        const username=`teja-${Math.random()}`;
        const password="123123123"

        const response= await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            password
        });
        expect(response.statusCode).toBe(400)

    })

    test("Signin success if crendtials are correct",async()=>{
        const username= "teja"+Math.random();
        const password ="12312312"
        await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password
        });

        const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            username,
            password
        })
        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    })

    test("Signin fails if crendtials are incorrect",async()=>{
        const username= "teja"+Math.random();
        const password ="12312312"
        await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password
        });

        const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            username:"WrongUsername",
            password
        })
        expect(response.statusCode).toBe(403);
      })

})

describe("User metadata endpoints",()=>{
    let token="";
    let avatarId="";
   beforeAll(async()=>{

        const username= "teja"+Math.random();
        const password ="12312312"
        await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password,
            type:"admin"
        });

        const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            username,
            password
        })

        
        const avatarResponse= await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        avatarId=avatarResponse.data.avatarId;
   })

       test("User cant update their metadata with a wrong avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: "123123123"
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(400)
    })

    test("User can update their metadata with the right avatar id", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        }, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })

        expect(response.status).toBe(200)
    })

    test("User is not able to update their metadata if the auth header is not present", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        })

        expect(response.status).toBe(403)
    })

})
//describe blocks


describe("User avatar info",()=>{

    let token="";
    let avatarId="";
    let userId="";
   beforeAll(async()=>{

        const username= "teja"+Math.random();
        const password ="12312312"
        const signUpResponse=await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username,
            password,
            type:"admin"
        });
        userId=signUpResponse.data.userId;

        const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
            username,
            password
        })

        
        const avatarResponse= await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },{
            headers:{
                "authorization": `Bearer ${token}`
            }
        })
        avatarId=avatarResponse.data.avatarId;
   })

   test("get back avatar info",()=>{
    const response=axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
   })

   test("Available avatars lists the recently created avatar", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currentAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currentAvatar).toBeDefined()
    })


})