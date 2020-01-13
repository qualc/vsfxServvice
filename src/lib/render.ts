import * as fs from 'fs';
import * as mume from '@shd101wyy/mume';
const Memu = mume.init();

export default function Render(lastId, title, content) {
    //
    content += `<img src="http://blog.qualc.cn/restapi/article/visitors.jpg?id=${lastId}" style="display: none">`;
    const htmlFile = `/data/web_tbwork_static/html/${lastId}.html`;
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
                    // /data/web_tbwork_static/html/Set、Map、WeakSet 和 WeakMap 的区别.html
                    fs.renameSync(str, htmlFile);
                })
                .catch(err => {
                    console.log('md转为html失败' + err.message);
                });
        });
    });
}
