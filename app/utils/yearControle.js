
import { supabaseClient } from "./supabaseClient";

export const addyear = async ({token,selectedYear}) => {
    const supabase = await supabaseClient(token);
    const {error} = await supabase.from("annee").insert({
        annee:selectedYear,
        
    });

    const { data } = await supabase
    .from("annee")
    .select()
    .eq('annee', selectedYear);


    const annee_id = data[0].id; 
    const annee_name = data[0].annee; 


    for (let i = 1; i <= 3; i++) {
        const trimesterNumber = `trimester ${i}`;
        await supabase.from("trimestre").insert({
            annee: annee_id,
            trimestre: trimesterNumber,
            annee_name:annee_name
        })
    } 

   
/*     const { data: trimestres, error: fetchError } = await supabase
    .from("trimestre")
    .select("id")
    .eq("annee",annee_id)


    for (let i = 0; i < trimestres.length; i++) {
        const trimestreId = trimestres[i].id;
    
        // Insert niveaux for the current trimestre
        for (let j = 1; j <= 5; j++) {
            const niveauNumber = `niveau ${j}`;
            await supabase.from("niveaux").insert({
                trimestre: trimestreId, // Assuming the column name is 'trimestre_id'
                niveau: niveauNumber
            });
        }
    }
 */



    if(error) {
        console.log("error")
    }

}


export const deleteYear = async ({ token, id }) => {
    const supabase = await supabaseClient(token);
    const { error } = await supabase.from("annee").delete().eq('id', id);

    if (error) {
        console.error("Error deleting year:", error);
    }

};

export const updateYear = async ({ token, id, update_Year }) => {

    console.log(id,update_Year)
    try {
        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from("annee")
            .update({ annee: update_Year })
            .eq('id', id);

        if (error) {
            console.error("Error updating year:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error updating year:", error);
        return null;
    }
};


export const getYears = async ({token}) => {
    try {
      const supabase = await supabaseClient(token);
      const { data } = await supabase
        .from('annee')
        .select('*');
  
    
      return data;
  
    } catch (error) {
      console.error('Error deleting todo:', error.message);
      return { success: false, error: error.message };
    }
  };