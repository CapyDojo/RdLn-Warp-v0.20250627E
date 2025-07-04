# RdLn Document Comparison Tool

*Professional-grade document comparison with modern glassmorphism UI*

## Overview

RdLn is a sophisticated document comparison tool designed for legal professionals and organizations requiring precise document analysis. Built with React, TypeScript, and modern UI technologies, it provides client-side document processing with complete confidentiality.

## ✨ Latest Updates - Version 0.2.5

### Waterfall Theme Selector
- **🌊 NEW**: Elegant cascading hover effect for theme selection with physics-based animations
- **🎨 AUTHENTIC PREVIEWS**: Each theme card displays using that theme's actual colors and styling
- **✨ 3D ANIMATIONS**: Cards "waterfall down" with bounce physics and "roll back up" in reverse
- **🎯 DRAG & DROP**: Always-on reordering with persistent localStorage
- **🚀 PORTAL RENDERING**: React Portal prevents header clipping for seamless interaction

### Previous Updates - Version 0.2.2
- **Glass Panel Visual Consistency**: Unified glassmorphism effects across all panels
- **Performance Optimization**: Chunked rendering for large documents
- **DOM Structure**: Streamlined component architecture

## 🚀 Key Features

- **Professional Document Comparison**: Myers algorithm-based diff engine optimized for legal documents
- **OCR Integration**: Multi-language optical character recognition with 50+ language support
- **Glassmorphism UI**: Modern, professional interface with consistent visual effects
- **Client-Side Processing**: Complete confidentiality with no server uploads
- **Performance Optimized**: Chunked rendering for large documents (500k+ characters)
- **System Protection**: Smart resource management prevents browser crashes

## 🏗️ Architecture

### Core Components
- **TextInputPanel**: Input areas with OCR and drag-drop support
- **RedlineOutput**: Chunked rendering for diff visualization
- **ComparisonInterface**: Main orchestration component
- **MyersAlgorithm**: Core comparison engine

### Visual Consistency
- **Unified DOM Structure**: All panels use identical component architecture
- **Background Normalization**: CSS rules ensure consistent glassmorphism effects
- **Chunk Optimization**: Streamlined rendering prevents compound glass effects

## 🛠️ Development

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Guidelines
- **SSMR Approach**: Safe, Step-by-step, Modular, Reversible changes
- **Visual Consistency**: Maintain DOM structure parity between components
- **Performance First**: Optimize for large document handling
- **TypeScript**: Full type safety throughout the codebase

## 📚 Documentation

- `GLASS_PANEL_VISUAL_CONSISTENCY_FIX.md` - Detailed technical handoff
- `DEVELOPMENT_GUIDELINES.md` - Comprehensive development standards
- `CHANGELOG.md` - Complete version history
- `TESTING_README.md` - Testing procedures and frameworks

## 🎯 Production Ready

✅ **Visual Consistency**: All panels display identical glassmorphism effects  
✅ **Performance Optimized**: Handles enterprise-scale documents efficiently  
✅ **Error Handling**: Robust error boundaries and graceful degradation  
✅ **TypeScript**: Zero compilation errors, full type safety  
✅ **Cross-Browser**: Compatible with modern browsers  

---

*For technical support or contributions, please refer to the comprehensive documentation included in this repository.*
