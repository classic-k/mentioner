
/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetch_username = async(members: any[]) => {

    const usernames = members.map((member) => {
       
        const user = member.user
        if(user.username)
        return user.username
    else
         return `[${user.first_name}](tg://user?id=${user.id})`
    })

    return usernames
}

export const save_to_db = async() => {
    
}