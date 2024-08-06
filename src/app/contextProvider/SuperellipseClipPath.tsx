// Superellipse clip path
const SuperellipseClipPath: React.FC = () => {
  return (
    <svg width="0" height="0">
      <defs>
        <clipPath id="SquircleClip-1" clipPathUnits="objectBoundingBox">
          <path
            d="M 0,0.5
                      C 0,0  0,0  0.5,0
                        1,0  1,0  1,0.5
                        1,1  1,1  0.5,1
                        0,1  0,1  0,0.5"
          ></path>
        </clipPath>
        <clipPath id="SquircleClip-2" clipPathUnits="objectBoundingBox">
          <path
            d="M 0,0.5
                      C 0,0.0575  0.0575,0  0.5,0
                        0.9425,0  1,0.0575  1,0.5
                        1,0.9425  0.9425,1  0.5,1
                        0.0575,1  0,0.9425  0,0.5"
          ></path>
        </clipPath>
        <clipPath id="SquircleClip-3" clipPathUnits="objectBoundingBox">
          <path
            d="M 0,0.5
                      C 0,0.115  0.115,0  0.5,0
                        0.885,0  1,0.115  1,0.5
                        1,0.885  0.885,1  0.5,1
                        0.115,1  0,0.885  0,0.5"
          ></path>
        </clipPath>
        <clipPath id="SquircleClip-4" clipPathUnits="objectBoundingBox">
          <path
            d="M 0,0.5
                      C 0,0.1725  0.1725,0  0.5,0
                        0.8275,0  1,0.1725  1,0.5
                        1,0.8275  0.8275,1  0.5,1
                        0.1725,1  0,0.8275  0,0.5"
          ></path>
        </clipPath>
        <clipPath id="SquircleClip-5" clipPathUnits="objectBoundingBox">
          <path
            d="M 0,0.5
                      C 0,0.23  0.23,0  0.5,0
                        0.77,0  1,0.23  1,0.5
                        1,0.77  0.77,1  0.5,1
                        0.23,1  0,0.77  0,0.5"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export default SuperellipseClipPath;
