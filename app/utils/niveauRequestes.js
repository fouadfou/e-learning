import { supabaseClient } from "./supabaseClient";


export const addniveaux = async ({token,annee_id}) => {
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase
    .from("tirmestre")
    .select("id")
    .eq("annee",annee_id)


    console.log(data)

}

