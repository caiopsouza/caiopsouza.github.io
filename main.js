System.register("math/vec", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function vec3(a, b, c) {
        return [a, b, c];
    }
    exports_1("vec3", vec3);
    function flatten(arr) {
        return new Float32Array(arr.flat(1));
    }
    exports_1("flatten", flatten);
    function lerp(u, v, s) {
        return [0, 1, 2].map((i) => (1.0 - s) * u[i] + s * v[i]);
    }
    exports_1("lerp", lerp);
    function vec4(a, b, c, d) {
        return [a, b, c, d];
    }
    exports_1("vec4", vec4);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("conn/http", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function get(url) {
        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);
        return request.responseText;
    }
    exports_2("get", get);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("main", ["math/vec", "conn/http"], function (exports_3, context_3) {
    "use strict";
    var vec_1, http_1;
    var __moduleName = context_3 && context_3.id;
    function uniform1f(gl, program, name) {
        const location = gl.getUniformLocation(program, name);
        return (value) => gl.uniform1f(location, value);
    }
    function createAttribute(gl, program, name, values) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vec_1.flatten(values), gl.STATIC_DRAW);
        var attr = gl.getAttribLocation(program, name);
        gl.vertexAttribPointer(attr, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attr);
    }
    function initProgram(gl) {
        const program = gl.createProgram();
        if (!program)
            throw new Error(`Unable to create program.`);
        function loadShader(type, url) {
            const shader = gl.createShader(type);
            if (!shader)
                throw new Error(`Unable to create shader $type.`);
            gl.shaderSource(shader, http_1.get(url));
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw gl.getShaderInfoLog(shader);
            gl.attachShader(program, shader);
            return shader;
        }
        loadShader(gl.VERTEX_SHADER, "/shader.vert");
        loadShader(gl.FRAGMENT_SHADER, "/shader.frag");
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw gl.getProgramInfoLog(program);
        gl.useProgram(program);
        return program;
    }
    function main() {
        const canvas = document.querySelector("#gl-canvas");
        if (!canvas)
            throw new Error(`Unable to create canvas.`);
        const gl = canvas.getContext("webgl");
        if (!gl)
            throw new Error(`Unable to create GL context.`);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        const program = initProgram(gl);
        const square = [
            vec_1.vec3(0, 1, 0),
            vec_1.vec3(1, 0, 0),
            vec_1.vec3(-1, 0, 0),
            vec_1.vec3(0, -1, 0),
        ];
        createAttribute(gl, program, "vPosition", square);
        let theta = uniform1f(gl, program, "theta");
        function render(input) {
            gl.clear(gl.COLOR_BUFFER_BIT);
            theta(parseFloat(input.value) * Math.PI);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, square.length);
        }
        var slide = document.getElementById("slide");
        if (!slide)
            throw new Error("Unable to find slide");
        render(slide);
        slide.oninput = (event) => render(event.target);
    }
    return {
        setters: [
            function (vec_1_1) {
                vec_1 = vec_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }
        ],
        execute: function () {
            window.onload = main;
        }
    };
});
//# sourceMappingURL=main.js.map