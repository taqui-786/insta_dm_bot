"use client";

import type React from "react";



export default function InstagramLogin() {

// useEffect(() => {
//   handleAutoReply()
// },[])
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Instagram className="h-6 w-6" />
            Send Instagram DM
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendDM} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Instagram Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter Instagram Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send DM"
              )}
            </Button>
          </form>
        </CardContent>
      </Card> */}
      <h1>Hey there</h1>
    </div>
  );
}
