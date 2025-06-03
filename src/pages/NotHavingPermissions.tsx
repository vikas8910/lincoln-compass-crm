const NotHavingPermissions = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="text-xl text-gray-600 mb-4">
          Oops! You don't have access
        </p>
        <span>Please contact your administrator</span>
      </div>
    </div>
  );
};

export default NotHavingPermissions;
