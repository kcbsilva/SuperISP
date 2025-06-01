// src/services/supabase/db.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function testConnection(): Promise<boolean> {
  try {
    // Test the connection by querying a simple test table
    const { data, error } = await supabase
      .from('connection_test')
      .select('id')
      .limit(1)

    // If no error, connection is good
    if (!error) {
      return true
    }

    // If table doesn't exist, that's still a successful connection
    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      return true
    }
    
    console.error('Supabase connection test failed:', error)
    return false
    
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

// Alternative test function that checks the Supabase REST API directly
export async function testConnectionAlt(): Promise<boolean> {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })
    
    return response.status === 200 || response.status === 404 // 404 is fine, means API is reachable
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}