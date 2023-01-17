uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

attribute vec3 aPosition;
attribute vec2 aCoords;

varying vec2 vCoords;

void main()
{ 
    vec4 position = aPosition, 1.0;
    gl_Position = projectionMatrix * viewMatrix * position;

    vCoords = aCoords;
}