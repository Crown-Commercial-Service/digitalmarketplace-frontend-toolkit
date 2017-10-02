import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn


PORT = 8000


class MultiThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    # Ctrl-C will cleanly kill all spawned threads
    daemon_threads = True
    # much faster rebinding
    allow_reuse_address = True


httpd = MultiThreadedHTTPServer(("", PORT), SimpleHTTPRequestHandler)
print("serving at port {}".format(PORT))

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    sys.exit(0)
