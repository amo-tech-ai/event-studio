Use Supabase with React

Learn how to create a Supabase project, add some sample data to your database, and query the data from a React app.

1
Create a Supabase project
Go to database.new and create a new Supabase project.

Alternatively, you can create a project using the Management API:

# First, get your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
# List your organizations to get the organization ID
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  https://api.supabase.com/v1/organizations
# Create a new project (replace <org-id> with your organization ID)
curl -X POST https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_id": "<org-id>",
    "name": "My Project",
    "region": "us-east-1",
    "db_pass": "<your-secure-password>"
  }'
When your project is up and running, go to the Table Editor, create a new table and insert some data.

Alternatively, you can run the following snippet in your project's SQL Editor. This will create a instruments table with some sample data.

-- Create the table
create table instruments (
  id bigint primary key generated always as identity,
  name text not null
);
-- Insert some sample data into the table
insert into instruments (name)
values
  ('violin'),
  ('viola'),
  ('cello');
alter table instruments enable row level security;
Make the data in your table publicly readable by adding an RLS policy:

create policy "public can read instruments"
on public.instruments
for select to anon
using (true);
2
Create a React app
Create a React app using a Vite template.

Terminal
npm create vite@latest my-app -- --template react
3
Install the Supabase client library
The fastest way to get started is to use the supabase-js client library which provides a convenient interface for working with Supabase from a React app.

Navigate to the React app and install supabase-js.

Terminal
cd my-app && npm install @supabase/supabase-js
4
Declare Supabase Environment Variables
Create a .env.local file and populate with your Supabase connection variables:

Project URL
event / eventos
https://asrzdtpyrdgyggqdfwwl.supabase.co

Publishable key
event / eventos
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcnpkdHB5cmRneWdncWRmd3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjY4NDMsImV4cCI6MjA3NTc0Mjg0M30.dz9YKRsUNv4G7K9u-6ZyEVuRImInbt-pfaggB7SXGmM


.env.local
VITE_SUPABASE_URL=<SUBSTITUTE_SUPABASE_URL>
VITE_SUPABASE_PUBLISHABLE_KEY=<SUBSTITUTE_SUPABASE_PUBLISHABLE_KEY>
5
Query data from the app
Replace the contents of App.jsx to add a getInstruments function to fetch the data and display the query result to the page using a Supabase client.

src/App.jsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
function App() {
  const [instruments, setInstruments] = useState([]);
  useEffect(() => {
    getInstruments();
  }, []);
  async function getInstruments() {
    const { data } = await supabase.from("instruments").select();
    setInstruments(data);
  }
  return (
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
  );
}
export default App;
6
Start the app
Run the development server, go to http://localhost:5173 in a browser and you should see the list of instruments.

Terminal
npm run dev