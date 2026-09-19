"""Tiny local web server for testing (developers only – NOT needed to use the website).
Serves the current folder on http://127.0.0.1:4173 and tells the browser never to cache,
so every edit shows up immediately."""
import http.server
import socketserver


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

    def log_message(self, fmt, *args):  # keep the console quiet
        pass


socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('127.0.0.1', 4173), NoCacheHandler) as server:
    server.serve_forever()
