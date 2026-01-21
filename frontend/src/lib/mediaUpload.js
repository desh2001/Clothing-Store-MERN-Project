import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://fluldufbxekszalxvtkq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsdWxkdWZieGVrc3phbHh2dGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzY1MzIsImV4cCI6MjA4MDI1MjUzMn0.Bo1GWmi6soz0smUkKwNu0Pu6M38HGRgtu-wQojctQiQ"

const supabase = createClient(supabaseUrl, supabaseKey);

export default function uploadFile(file) {

    return new Promise((resolve, reject) => {
        const timeStamp = Date.now();
        const fileName = timeStamp + "_" + file.name;
        supabase.storage.from("images").upload(fileName, file,{
            cacheControl: '3600',
            upsert: false
        }).then(() => {
            const publicUrl = supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;
            resolve(publicUrl);
        }).catch((error) => {
            reject(error);
        });


});    }
