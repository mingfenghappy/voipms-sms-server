/*
 * VoIP.ms SMS Server
 * Copyright (C) 2015-2016 Michael Kourlas
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Server} from "./server";
import * as fs from "fs";
import * as http from "http";
import * as log from "winston";

const IP = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
const PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const KEY_PATH = process.env.OPENSHIFT_DATA_DIR ?
                 `${process.env.OPENSHIFT_DATA_DIR}/key.txt` : "./data/key.txt";
const KEY = fs.readFileSync(KEY_PATH, {encoding: "UTF-8"}).trim();

const server = new Server(KEY);
server.init(() => {
    const httpServer = http.createServer(server.app);
    httpServer.on("listening", () => {
        log.info(`Server listening on ${IP}:${PORT}`);
    });
    httpServer.on("error", (err) => {
        log.error("Error occurred while starting server", {err});
    });
    httpServer.listen(PORT, IP);
});
