import * as fs from 'fs';
import * as mume from '@shd101wyy/mume';
const Memu = mume.init();

export default function Render(lastId, title, content) {
    //
    fs.writeFile(`/data/web_tbwork_static/html/${title}.md`, content, function(err) {
        if (err) {
            console.log('写入md文件失败' + err.message);
        }
        Memu.then(() => {
            const engine = new mume.MarkdownEngine({
                filePath: `/data/web_tbwork_static/html/${title}.md`,
                projectDirectoryPath: `/data/web_tbwork_static/html`,
                config: {
                    previewTheme: 'github-light.css',
                    // revealjsTheme: "white.css"
                    codeBlockTheme: 'atom-dark.css',
                    printBackground: true,
                    enableScriptExecution: true // <= for running code chunks
                }
            });
            engine
                .htmlExport({ offline: false, runAllCodeChunks: true })
                .then(str => {
                    console.log(str);
                })
                .catch(err => {
                    console.log('md转为html失败' + err.message);
                });
        });
    });
}
