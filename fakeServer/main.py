#_*_ coding: utf-8_*_

#author lxm
#startDate 2017/2/13
#finishDate

#tornado import
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import os
from tornado.options import define, options

# from zou
import tornado.web
from tornado.web import MissingArgumentError

#define port : localhost
define('port',default=5000,type = int)

class CpuinfoHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        content = '''
        [
        {
            "hz": "2.1000 GHz",
            "cores": 4,
            "brand": "Intel(R) Core(TM) i7-4770HQ CPU @ 2.10GHz",
            "cpu_pct": 3
        },
        {
            "hz": "2.2000 GHz",
            "cores": 8,
            "brand": "Intel(R) Core(TM) i7-4770HQ CPU @ 2.20GHz",
            "cpu_pct": 4.5
        }
        ]
        '''
        self.write(content)

class AlgchainsHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        content = '''{"2100": '1'}'''
        self.write(content)


# "training_network": {editable_param_list: [
#     Param{type, d_type, default_value, set_value}
# ]}

class AlgpluginsHandler(tornado.web.RequestHandler):
    def get(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        content ='''
        [
        {
            "plugin_id": 11,
            "plugin_name": "plugin11",
            "plugin_owner": "general",
            "original_plugin_id": 1,
            "plugin_description": "description",
            "has_training_network": true,
            "training_network":
                {
                  "layers": [
                      {
                          "layerTypeId": 0,
                          "id": "layer1",
                          "name": "Input_1",
                          "x": 10,
                          "y": 10,
                          "color": "#369",
                          "layer_params":[
                              {
                                    "name": "loss",
                                    "translation": "损失",
                                    "description": "result of loss from model calculation?",
                                    "type": "FLOAT",
                                    "d_type": "FLOAT",
                                    "shape":[1],
                                    "allowed_values": [],
                                    "default_value": 0.0,
                                    "set_value": 0.4
                              }
                          ]
                      },
                      {
                          "layerTypeId": 0,
                          "id": "layer2",
                          "name": "Output2",
                          "x": 10,
                          "y": 10,
                          "color": "#888",
                          "layer_params":[
                              {
                                    "name": "accuracy",
                                    "translation": "精度",
                                    "description": "result accuracy",
                                    "type": "FLOAT",
                                    "d_type": "FLOAT",
                                    "shape":[1],
                                    "allowed_values": [],
                                    "default_value": 0.0,
                                    "set_value": 0.9
                              }
                          ]
                      }
                  ],

                  "links": [
                      {"srcLayerId": "layer1", "destLayerId": "layer2", "srcx": 10, "srcy": 10, "destx": 30, "desty": 30}
                  ]
                },
            "editable_param_list": [
                {"name": "param1", "type": "STRING", "d_type": "STRING", "default_value": "lalala1", "set_value": "lalala1"},
                {"name": "param2", "type": "STRING", "d_type": "STRING", "default_value": "lalala2", "set_value": "lalala2"},
                {"name": "param3", "type": "STRING", "d_type": "STRING", "default_value": "lalala3", "set_value": "lalala3"},
                {"name": "param4", "type": "STRING", "d_type": "STRING", "default_value": "lalala4", "set_value": "lalala4"}
            ]
        },
        {
            "plugin_id": 12,
            "plugin_name": "plugin12",
            "plugin_owner": "admin",
            "original_plugin_id": 2,
            "plugin_description": "description",
            "has_training_network": true,
            "training_network": "",
            "editable_param_list": [
                {"name": "param1", "type": "STRING", "d_type": "STRING", "default_value": "lala1", "set_value": "lala1"}
            ]
        }
        ]
        '''
        self.write(content)

#setting
if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = tornado.web.Application(
            handlers=[
                (r"/cpuinfo", CpuinfoHandler),
                (r"/algchains",AlgchainsHandler),
                (r"/algplugins", AlgpluginsHandler),
            ],
            template_path=os.path.join(os.path.dirname(__file__),'templates'),
            static_path=os.path.join(os.path.dirname(__file__),'static')
            )

#api for database
# def connectToMysql():
#     conn = pymongo.Connection("localhost", 27017)


#basic start
http_server = tornado.httpserver.HTTPServer(app)
http_server.listen(options.port)
tornado.ioloop.IOLoop.instance().start()
#connect database
# connectToMysql()
