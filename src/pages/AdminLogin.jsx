import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Palmtree, Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin');
      } else {
        setError('Username atau password salah.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Palmtree className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Login Portal Admin</h2>
          <p className="text-muted-foreground mt-2">Kelola konten dan pesanan Nusantara</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Masuk</CardTitle>
            <CardDescription>Masukkan kredensial Anda untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
