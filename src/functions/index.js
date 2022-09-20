const RC = require('@ringcentral/sdk').SDK
// require('dotenv').config();

const RECIPIENT = process.env.SMS_RECIPIENT

var rcsdk = new RC({
    'server':       process.env.RC_SERVER_URL,
    'clientId':     process.env.RC_CLIENT_ID,
    'clientSecret': process.env.RC_CLIENT_SECRET
});
var platform = rcsdk.platform();
platform.login({
    'username':  process.env.RC_USERNAME,
    'password':  process.env.RC_PASSWORD,
    'extension': process.env.RC_EXTENSION
})

platform.on(platform.events.loginSuccess, async function(e){
    // read_extension_phone_number()
    get_teams()
});



let read_extension_phone_number = async () => {
        try {
            var resp = await platform.get("/restapi/v1.0/account/~/extension/~/phone-number")
            var jsonObj = await resp.json()
            for (var record of jsonObj.records){
                for (feature of record.features){
                    if (feature == "SmsSender"){
                        return send_sms(record.phoneNumber)
                    }
                }
            }
        } catch(e) {
            console.log(e.message)
         
        }
}

let send_sms = async (fromNumber) => {
        try {
            var resp = await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
                from: {'phoneNumber': fromNumber},
                to: [{'phoneNumber': RECIPIENT}],
                text: 'Hello World from JavaScript'
            })
            var jsonObj = await resp.json()
            console.log("SMS sent. Message status: " + jsonObj.messageStatus)
        } catch(e) {
            console.log(e.message)
            
        }
}

let get_messages = async () => {
    try {
        var resp = await platform.post('/restapi/v1.0/glip/chats/chatId/posts', {
            from: {'phoneNumber': fromNumber},
            to: [{'phoneNumber': RECIPIENT}],
            text: 'Hello World from JavaScript'
        })
        var jsonObj = await resp.json()
        console.log("SMS sent. Message status: " + jsonObj.messageStatus)
    } catch(e) {
        console.log(e.message)
        
    }
}

let get_teams = async () => {
    try {
        var resp = await platform.get(`/restapi/v1.0/glip/chats?type=Team&recordCount=100`)
        var jsonObj = await resp.json()
        console.log("Get Teams: ",jsonObj.records)
        if(jsonObj.records) {
            let allTeamIds = jsonObj.records.map(x => x.id)
            console.log('allTeamIds -> ',allTeamIds);
            
            allTeamIds.map(async (id) => {
                // await get_posts(id)
            })
            // Get All Chats From Here


        }

    } catch(e) {
        console.log(e)
    }
}

let create_new_conversation = async (user) => {
    var resp = await platform.post(`/restapi/v1.0/glip/conversations`, {
        members: [{id: ''},{email:''}]
    })
    var jsonObj = await resp.json();
}

let get_conversations = async (user) => {
    var resp = await platform.get(`/restapi/v1.0/glip/conversations?recordCount=50`)
    var jsonObj = await resp.json();
}

let get_posts = async (chatId) => {
    var resp = await platform.get(`/restapi/v1.0/glip/chats/${chatId}/posts?recordCount=50`)
    var jsonObj = await resp.json();
    console.log('Posts -> ',jsonObj)
}


let create_posts = async (chatId) => {
    var resp = await platform.post(`/restapi/v1.0/glip/chats/${chatId}/posts`,{
        text: "Dummy Text"
    })
    var jsonObj = await resp.json();
    console.log('Posts -> ',jsonObj)
}



module.exports = {
    // Get All Team Members
    getAllTeam: async (user,message) => {
        try {
            var resp = await platform.get('/restapi/v1.0/glip/teams', {
                recordCount: 100
            })

            var jsonObj = await resp.json()
            // console.log('Get All Teams response -> ',jsonObj)

            let teamMembers = jsonObj.records;

           console.log('teamMembers -> ',teamMembers)
           
            
        } catch(e) {
            console.log(e)
           
        }
    },
    // Create Team On Message Receive
    createNewTeam: async (user,message) => {
        try {
            var resp = await  platform.post(`/restapi/v1.0/glip/teams`,{
                public: true,
                name: `Patient - ${user.fullname}`,
                description: 'Catched From Eazy.im',
            }).then((response) => {
                // PROCESS RESPONSE
                console.log('response -> ',JSON.stringify(response.json()))
            }).catch((err)=>{
                console.log('err -> ',err)
            })
            
        } catch(e) {
            console.log(e.message)
            
        }
    },
    createNewTeam2: async function(user,message) {
        var endpoint = "/restapi/v1.0/glip/teams"
        var params = {
          public: true,
          name: `Patient-${user.fullname}`,
          members: [{ email: "omair.sohail@thenextac.com" }, { email: "omair2@thenextac.com" }],
          description: "Got Message from eazy.im"
        }
        try {
          var resp = await platform.post(endpoint, params)
          var jsonObj = await resp.json()
          console.log(JSON.stringify(jsonObj))
        } catch (e) {
          console.log(e)
        }
    }
}








