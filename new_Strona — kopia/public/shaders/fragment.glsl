precision highp float;

varying vec2 vCoords;

uniform sampler2D uSampler;

void main()
{
    gl_FragColor = texture2D(uSampler, vCoords);
}