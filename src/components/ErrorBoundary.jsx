import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, message: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, message: error.message };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <p style={{ color: 'red', marginBottom: 16 }}>
                        Something went wrong: {this.state.message}
                    </p>
                    <button onClick={() => this.setState({ hasError: false, message: '' })}>
                        Try again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}