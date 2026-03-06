<script>
  export let size = 80;
</script>

<div class="sapphire-gem" style="width: {size}px; height: {size}px;">
  <div class="gem">
    <div class="top-facet"></div>
    <div class="crown"></div>
    <div class="pavilion"></div>
    <div class="sparkle sparkle-1"></div>
    <div class="sparkle sparkle-2"></div>
    <div class="sparkle sparkle-3"></div>
  </div>
</div>

<style>
  .sapphire-gem {
    position: relative;
    display: inline-block;
    filter: drop-shadow(0 8px 16px rgba(30, 58, 138, 0.4));
  }

  .gem {
    width: 100%;
    height: 100%;
    position: relative;
    animation: subtle-rotate 8s ease-in-out infinite;
  }

  @keyframes subtle-rotate {
    0%, 100% { transform: rotateZ(0deg) rotateY(0deg); }
    50% { transform: rotateZ(3deg) rotateY(10deg); }
  }

  /* Top facet (table) */
  .top-facet {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 8%;
    background: linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%);
    clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  }

  /* Crown (upper part) */
  .crown {
    position: absolute;
    top: 23%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 30%;
    background: linear-gradient(135deg,
      #1e3a8a 0%,
      #2563eb 30%,
      #3b82f6 50%,
      #60a5fa 70%,
      #93c5fd 100%
    );
    clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%);
    box-shadow: 
      inset 0 4px 8px rgba(147, 197, 253, 0.3),
      inset 0 -4px 8px rgba(30, 58, 138, 0.5);
  }

  /* Pavilion (lower part) */
  .pavilion {
    position: absolute;
    top: 53%;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 47%;
    background: linear-gradient(180deg,
      #2563eb 0%,
      #1e40af 40%,
      #1e3a8a 70%,
      #1e293b 100%
    );
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    box-shadow: 
      inset 0 8px 16px rgba(30, 58, 138, 0.6),
      inset 0 -4px 8px rgba(147, 197, 253, 0.2);
  }

  /* Sparkles */
  .sparkle {
    position: absolute;
    background: radial-gradient(circle,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0.8) 30%,
      transparent 70%
    );
    border-radius: 50%;
    animation: sparkle-shine 2s ease-in-out infinite;
  }

  .sparkle-1 {
    top: 20%;
    left: 30%;
    width: 15%;
    height: 15%;
    animation-delay: 0s;
  }

  .sparkle-2 {
    top: 30%;
    right: 25%;
    width: 10%;
    height: 10%;
    animation-delay: 0.7s;
  }

  .sparkle-3 {
    top: 45%;
    left: 50%;
    transform: translateX(-50%);
    width: 8%;
    height: 8%;
    animation-delay: 1.4s;
  }

  @keyframes sparkle-shine {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.3);
    }
  }

  /* Add subtle glow */
  .gem::after {
    content: '';
    position: absolute;
    inset: -10%;
    background: radial-gradient(circle,
      rgba(59, 130, 246, 0.3) 0%,
      transparent 70%
    );
    animation: glow-pulse 4s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes glow-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
</style>