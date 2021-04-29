/*
 * @LastEditTime: 2021-04-29 20:02:22
 * @LastEditors: jinxiaojian
 */

// 创建 WebGL 上下文
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

// 创建定点着色器,片作色器代码
const vertex = `
attribute vec2 position;
varying vec3 color;

void main() {
  gl_PointSize = 1.0;
  color = vec3(0.5 + position * 0.5, 0.0);
  gl_Position = vec4(position * 0.5, 1.0, 1.0);
}
`;
const fragment = `
  precision mediump float;
  varying vec3 color;
  void main()
  {
    gl_FragColor = vec4(color, 1.0);
  }    
`;

//生成图形形状
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);
//生成图形形状
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(fragmentShader);
//生成场景
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
//应用图形
gl.linkProgram(program);
gl.useProgram(program);
// 定义要展示位置
const points = new Float32Array([
  -1, -1,
  0, 1,
  1, -1,
]);
//建立位置缓冲区
const bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

//缓冲区置入图形
const vPosition = gl.getAttribLocation(program, 'position');
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

//清空画布绘制
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);


// const vertex1 = `
//   attribute vec2 position;

//   void main() {
//     gl_PointSize = 1.0;
//     gl_Position = vec4(position, 1.0, 1.0);
//   }
// `;


// const fragment1 = `
//   precision mediump float;

//   void main()
//   {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//   }    
// `;


// const vertexShader1 = gl.createShader(gl.VERTEX_SHADER);
// gl.shaderSource(vertexShader1, vertex1);
// gl.compileShader(vertexShader1);


// const fragmentShader1 = gl.createShader(gl.FRAGMENT_SHADER);
// gl.shaderSource(fragmentShader1, fragment1);
// gl.compileShader(fragmentShader1);


// const program1 = gl.createProgram();
// gl.attachShader(program1, vertexShader1);
// gl.attachShader(program1, fragmentShader1);
// gl.linkProgram(program1);
// gl.useProgram(program1);

// const points1 = new Float32Array([
//   -1, 0.5,
//   -0.5, 1,
//   0, 0.5,
// ]);

// const bufferId1 = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
// gl.bufferData(gl.ARRAY_BUFFER, points1, gl.STATIC_DRAW);

// const vPosition1 = gl.getAttribLocation(program1, 'position');
// gl.vertexAttribPointer(vPosition1, 2, gl.FLOAT, false, 0, 0);
// gl.enableVertexAttribArray(vPosition1);

// gl.drawArrays(gl.TRIANGLES, 0, points1.length / 2);