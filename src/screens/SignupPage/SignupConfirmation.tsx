import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { CheckCircle, Mail, Home } from 'lucide-react';

export function SignupConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email address';

  // If no email was provided in state, redirect to signup
  useEffect(() => {
    if (!location.state?.email) {
      setTimeout(() => {
        navigate('/signup');
      }, 3000);
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-[calc(100vh-135px)] bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[560px] bg-white rounded-lg shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-[32px] font-bold text-[#6F6F6F] mb-2">
              Account Created Successfully!
            </h1>
            <p className="text-lg text-[#6F6F6F]">
              Thank you for registering with Ottawa Fun Sports League
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Mail className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-2">Verify Your Email</h2>
                <p className="text-blue-700 mb-3">
                  We've sent a verification email to:
                </p>
                <p className="text-blue-900 font-medium text-lg mb-4 break-all">
                  {email}
                </p>
                <p className="text-blue-700">
                  Please check your inbox and click the verification link to activate your account.
                </p>
                <p className="text-blue-700 mt-4 text-sm">
                  <strong>Note:</strong> If you don't see the email in your inbox, please check your spam or junk folder.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[#6F6F6F] mb-6">
              Once your email is verified, you can log in to access your account.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-[#B20000] hover:bg-[#8A0000] text-white rounded-[10px] px-8 py-3 flex items-center gap-2 mx-auto"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}