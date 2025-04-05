import TelegramBot from 'node-telegram-bot-api';
import { NextResponse } from 'next/server';
// import { fetch_username } from '../utils';
import Group, {connectDB} from "../model"


const bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: false });
const owner = process.env.OWNER as string
console.log(owner)
export async function GET() {

  try {
    const bot_me = await bot.getMe()
    console.log(bot_me)
    //  await connectDB()
    //  await Group.create({ group_id: "chat_id", group_name: "Tom Can talk", members: [] });
    return  NextResponse.json({ok: true})
  } 
  catch (error) {

    console.log("an error occur", error)
    return  NextResponse.json({ok: true, error: "error is here"}) 
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const add_user = async(user: any, group_id: string, bot_id: string) => {

if(String(user.id) === bot_id)
{
  return
}

const username = user.username? "@" + user.username : `<a href="tg://user?id=${user.id}">${user.first_name}</a>`
const user_id = user.id
await Group.findOneAndUpdate(
  { group_id },
  { $addToSet: { members: { user_id, username } } },
  { upsert: true }
);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const add_group = async(group: any) => {

  const grp_exist = await Group.findOne({group_id: group.id}, "group_id group_name")
 // console.log("Adding group now", group, grp_exist)
  if(!grp_exist)
  {
    Group.create({group_name: group.title, group_id: group.id, members: []})
    console.log("Group created")
  }
  }

export async function POST(reqs: Request) {
 
  try {
    const bot_me = await bot.getMe()
   
    const bot_id = String(bot_me.id)
   const req = await reqs.json()

   await connectDB()
   if(req.my_chat_member)
   {
    const my_chat = req.my_chat_member
    const chat = my_chat.chat
    const ty = chat.type 
    if(ty === "group")
    {
      await add_group(chat)
      
    }
    if(my_chat.new_chat_member)
    {
      
      const newUser = my_chat.new_chat_member.user
      await add_user(newUser, chat.id, bot_id)
      
    }
   }
   else if(req.message)
   {
    const chat= req.message.chat
    
    const text = req.message.text as string
    if(text && text.toLowerCase() === "/start")
    {
     const frm = String(req.message.from.id)
      
      if(frm !== owner)
      {
        const msg = `Visit github repo <a href="https://github.com/classic-k/mentioner">here</a> to setup bot as only owner can see list of Group to send notification`
        await bot.sendMessage(chat.id, msg, {
          parse_mode: "HTML"
        })
         return NextResponse.json({message: "sent"})

      }
      
      const groups = await Group.find()
      if(groups)
      {
        const btn_list = []
        for(const group of groups)
        {
          console.log(group)
            btn_list.push({text: group.group_name, callback_data: group.group_id})
        }

        console.log(btn_list.join(" "))
        await bot.sendMessage(chat.id, "Group List", {
          reply_markup: {
            inline_keyboard: [btn_list]
          }
        })
      }
    }
    if(chat.type === "supergroup" || chat.type === "group")
    {
      await add_group(chat)
    }

    if(req.message.new_chat_member)
      {
    
       for(const newUser of req.message.new_chat_members)
       {
        await add_user(newUser, chat.id, bot_id)
       }

      }
   }

   if(req.callback_query)
    {
  
      const res = req.callback_query.data;
      const group = await Group.findOne({group_id: res})
      if(group)
      {
        const mem_list: [] = group.members
        const grp_id = group.group_id
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const names = mem_list.map((user: any) => user.username)
        const str = names.join(" ")
        if(str !== "")
        await bot.sendMessage(grp_id, str, {parse_mode: "HTML"})
       
      }
    }

    /*
   const group_id = -4702398170

   const mems = await bot.getChatMemberCount(group_id)
 
   console.log("Mems count", mems)

   const members = await bot.getChatAdministrators(group_id)
   const usernames = await fetch_username(members)
   console.log(usernames)
   */
   return  NextResponse.json({message: "sent"})

  } 
  catch (error) {
    console.log(error)
    return  NextResponse.json({message: "An error occur try again"})
  }

}

