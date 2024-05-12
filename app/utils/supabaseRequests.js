import { supabaseClient } from "./supabaseClient";

export const getTodos = async ({ userId, token }) => {
    try {
      const supabase = await supabaseClient(token);
      const { data: todos, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId);
  
      if (error) {
        throw new Error(error.message);
      }
  
      return todos;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error; // Rethrow the error to handle it at the caller's level
    }
  };

export const addTodo = async ({userId,token, event}) => {
    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from("todos").insert({
        user_id:userId,
        title:event.target[0].value,
        note:event.target[1].value,
    });

    if(error) {
        console.log("error")
        return;
    }

    return data;
}


export const deleteTodo = async ({ userId,token , todoId }) => {
  try {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting todo:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    return { success: false, error: error.message };
  }
};


