{pkgs}: {
  channel = "stable-24.11"; # or "unstable"
  packages = [
    pkgs.nodejs_20
    pkgs.concurrently # For running multiple commands
  ];
  
  env = {
    NEXT_PUBLIC_API_URL = "http://localhost:3001"; # Set API URL for frontend
  };
  
  idx = {
    extensions = [];
    workspace = {
      onCreate = {
        default.openFiles = ["src/app/admin/dashboard/page.tsx"];
      };
    };
    
    previews = {
      enable = true;
      previews = {
        web = {
          command = [
            "concurrently" 
            "\"npm run dev -- --port $PORT --hostname 0.0.0.0\"" 
            "\"cd backend && node server.js\""
          ];
          manager = "web";
        };
      };
    };
  };
}