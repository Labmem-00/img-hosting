// pushImageWithName.js
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const process = require('process');

// 初始化 Git 库
const git = simpleGit(path.resolve(__dirname, './'));  // 确保路径正确

// 设定远程仓库 URL
const remoteUrl = 'https://github.com/Labmem-00/img-hosting';  // 替换为你的仓库地址

// 上传并提交指定文件
async function pushImage(imagePath, commitMessage = 'Add new image') {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file does not exist at path: ${imagePath}`);
    }

    // 获取图片文件名
    const imageName = path.basename(imagePath);

    // 1. 将图片文件添加到 Git 仓库
    await git.add(imagePath);
    console.log(`Added ${imageName} to git`);

    // 2. 提交更改
    await git.commit(commitMessage);
    console.log(`Committed ${imageName}`);

    // 3. 推送更改到远程仓库
    await git.push('origin', 'main');  // 或者替换为你当前使用的分支名
    console.log(`Pushed ${imageName} to GitHub`);

    // 4. 返回图片的 GitHub 地址
    const imageUrl = `https://cdn.jsdelivr.net/gh/Labmem-00/img-hosting@main/LabBlog/${imageName}`;
    return imageUrl;

  } catch (error) {
    console.error('Error pushing image:', error);
  }
}

// 通过命令行参数获取图片路径和文件名
const args = process.argv.slice(2);
const imagePath = args[0];  // 传入文件路径作为第一个参数
const commitMessage = args[1] || 'Add new image';  // 第二个参数为提交信息（可选）

if (imagePath) {
  pushImage(imagePath, commitMessage)
    .then((imageUrl) => {
      console.log('New image URL:', imageUrl);
    })
    .catch((err) => {
      console.error('Error:', err);
    });
} else {
  console.log('Please provide an image path as the first argument.');
}
